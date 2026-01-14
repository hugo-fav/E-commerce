// lib/createOrder.js
import { supabase } from "../supabaseClient";

export async function getOrders() {
  const { data, error } = await supabase
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
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
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
