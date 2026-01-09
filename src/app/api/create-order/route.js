import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { customer, items, totalAmount } = await req.json();

    // 1️⃣ Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_name: customer.fullName,
          user_email: customer.email,
          user_phone: customer.phone,
          delivery_address: customer.address,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2️⃣ Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return Response.json({ order });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
