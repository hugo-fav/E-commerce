"use client";

import { useCart } from "@/context/cartContext";
import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const { cartItems, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚫 Prevent hydration mismatch
  if (!mounted) return null;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <h2 className="text-lg font-medium">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2">
          Add items to your cart before checking out
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-medium tracking-wide uppercase">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500 tracking-wide">
          Complete your purchase below
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT — DELIVERY INFO */}
        <div>
          <h2 className="text-sm font-medium tracking-wide uppercase mb-6">
            Delivery Information
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />

            <textarea
              placeholder="Delivery Address"
              rows={4}
              className="w-full border border-gray-300 p-3 text-sm rounded resize-none focus:outline-none focus:border-black"
            />
          </form>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bg-gray-50 border border-gray-200 rounded p-6 h-fit">
          <h2 className="text-sm font-medium tracking-wide uppercase mb-6">
            Order Summary
          </h2>

          <ul className="space-y-4 text-sm">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="border-t mt-6 pt-4 flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <button
            disabled
            className="w-full mt-6 bg-black text-white py-3 rounded opacity-50 cursor-not-allowed text-sm tracking-wide"
          >
            Pay Now
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Payment integration coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
