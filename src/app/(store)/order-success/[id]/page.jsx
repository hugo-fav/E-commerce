"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const OrderSuccessPage = () => {
  const { id } = useParams(); // order ID from URL
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch the order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single(); // single because we expect 1 row

        if (orderError) throw orderError;

        setOrder(orderData);

        // Fetch the order items
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", id);

        if (itemsError) throw itemsError;

        setItems(itemsData || []);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Could not fetch your order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p>Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p className="text-red-500">{error || "Order not found."}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-black text-white rounded"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-medium tracking-wide uppercase">
          ✅ Order Successful!
        </h1>
        <p className="mt-2 text-gray-500">
          Your order ID is <strong>#{order.id}</strong>
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left — Delivery Info */}
        <div>
          <h2 className="text-sm font-medium tracking-wide uppercase mb-4">
            Delivery Information
          </h2>
          <p>
            <strong>Name:</strong> {order.user_name}
          </p>
          <p>
            <strong>Email:</strong> {order.user_email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user_phone}
          </p>
          <p>
            <strong>Address:</strong> {order.delivery_address}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        {/* Right — Items */}
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <h2 className="text-sm font-medium tracking-wide uppercase mb-4">
            Order Items
          </h2>
          <ul className="space-y-4 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-6 pt-4 flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>₦{order.total_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <p>
        Track your order:
        <a
          href={`/orders/track/${order.reference}`}
          className="text-blue-600 underline"
        >
          View Order
        </a>
      </p>

      <div className="text-center mt-10">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-black text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
