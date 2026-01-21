import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.text(); // must use text for signature check
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.error("No Paystack signature found!");
      return new Response("Missing signature", { status: 400 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid signature!");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);

    console.log("Webhook event received:", JSON.stringify(event, null, 2));

    if (event.event === "charge.success") {
      const { reference, metadata, amount } = event.data;
      const orderId = metadata?.order_id;

      if (!orderId) {
        console.error("Order ID missing in metadata");
        return new Response("Order ID missing", { status: 400 });
      }

      // Fetch the order
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select("id, total_amount, payment_status")
        .eq("id", orderId)
        .single();

      if (error || !order) {
        console.error("Order not found:", orderId);
        return new Response("Order not found", { status: 404 });
      }

      if (order.payment_status === "paid") {
        console.log("Order already paid:", orderId);
        return new Response("Already processed", { status: 200 });
      }

      const amountPaid = amount / 100; // convert kobo to Naira

      if (order.total_amount !== amountPaid) {
        console.error("Amount mismatch:", {
          expected: order.total_amount,
          got: amountPaid,
        });
        return new Response("Amount mismatch", { status: 400 });
      }

      // Update order
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          reference,
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Failed to update order:", updateError);
        return new Response("Failed to update order", { status: 500 });
      }

      console.log("Order marked as paid:", orderId);

      // --- Move stock reduction here (inside charge.success) ---
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (itemsError) {
        console.error("failed to fetch order items:", itemsError);
        // non-fatal: continue, but log
      } else {
        for (const item of orderItems) {
          // Prefer an RPC that does atomic decrement if you have it:
          // const { data: rpcData, error: rpcErr } = await supabaseAdmin
          //   .rpc("decrement_product_stock", { p_product_id: item.product_id, p_qty: item.quantity });
          // if (rpcErr) { console.error("RPC error", rpcErr); }

          // Fallback: read then update (note: potential race conditions)
          const { data: product, error: productError } = await supabaseAdmin
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (productError || !product) {
            console.error("product not found", item.product_id);
            continue;
          }

          const newStock = Math.max((product.stock || 0) - item.quantity, 0);

          const { error: stockError } = await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.product_id);

          if (stockError) {
            console.error(
              `failed to update for product ${item.product_id}`,
              stockError
            );
          } else {
            console.log(
              `Product ${item.product_id} stock updated -> ${newStock}`
            );
          }
        }
      }
    }
    

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Server error", { status: 500 });
  }
}
