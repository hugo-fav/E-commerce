// lib/createOrder.js
import { supabase } from "../supabaseClient";

export async function getOrders({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
} = {}) {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          images
        )
      ),order_status_history(
      id, status, created_at)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .order("created_at", {
      foreignTable: "order_status_history",
      ascending: true,
    });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const q = String(search || "").trim();
  if (q.length > 0) {
    const pattern = `%${q}%`;
    // build a single no-whitespace string for .or()
    const orStr = `reference.ilike.${pattern},user_email.ilike.${pattern},user_phone.ilike.${pattern},user_name.ilike.${pattern}`;
    query = query.or(orStr);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { orders: data || [], total: Number(count) || 0, page, limit, status };
}

export const createOrder = async ({ customer, items, totalAmount }) => {
  const reference = Math.random().toString(36).substring(2, 10).toUpperCase();

  // 1️⃣ Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        reference,
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

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw orderError;
  }

  // 2️⃣ Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    name: item.name,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    throw itemsError;
  }

  return order;
};
