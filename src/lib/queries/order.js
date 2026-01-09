// lib/createOrder.js
import { supabase } from "../supabaseClient";

export const createOrder = async ({ customer, items, totalAmount }) => {
  // 1️⃣ Insert order
  const { data: order, error: orderError } = await supabase
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
