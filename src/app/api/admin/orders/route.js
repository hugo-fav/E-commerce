import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderStatusEmail } from "@/lib/email";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const orderId = body.orderId ?? body.order_id ?? body.id;
    const status = body.status;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    // 1️⃣ Update order AND RETURN UPDATED ROW
    const { data: updatedOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError) throw orderError;

    // 🔍 CONFIRM DATA
    console.log("UPDATED ORDER:", updatedOrder);

    // 2️⃣ Insert status history
    await supabaseAdmin.from("order_status_history").insert({
      order_id: orderId,
      status,
    });

    // 3️⃣ Send email (NOW DATA EXISTS)
    await sendOrderStatusEmail({
      to: "favourugochukwu548@gmail.com",
      name: updatedOrder.user_name,
      reference: updatedOrder.reference,
      status: updatedOrder.status,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/orders:", err);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
