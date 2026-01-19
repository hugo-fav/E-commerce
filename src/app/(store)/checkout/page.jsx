"use client";

import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, subtotal } = useCart();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const isValid =
    checkoutData.fullName &&
    checkoutData.email &&
    checkoutData.phone &&
    checkoutData.address;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return alert("Cart is empty");
    if (!isValid) return alert("Please fill all fields");

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkoutData,
          items: cartItems,
          totalAmount: Number(subtotal), // ensure numeric
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Checkout API error:", data);
        throw new Error(data?.error || "Checkout failed");
      }

      if (!data?.authorization_url) {
        console.error("No authorization_url in response:", data);
        alert("Payment initialization failed. Check server logs.");
        return;
      }

      // redirect user to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!cartItems.length) {
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
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-medium tracking-wide uppercase">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500 tracking-wide">
          Complete your purchase below
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* DELIVERY INFO */}
        <div>
          <h2 className="text-sm font-medium tracking-wide uppercase mb-6">
            Delivery Information
          </h2>
          <form className="space-y-5">
            <input
              name="fullName"
              value={checkoutData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />
            <input
              name="email"
              value={checkoutData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />
            <input
              name="phone"
              value={checkoutData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 p-3 text-sm rounded focus:outline-none focus:border-black"
            />
            <textarea
              name="address"
              value={checkoutData.address}
              onChange={handleChange}
              placeholder="Delivery Address"
              rows={4}
              className="w-full border border-gray-300 p-3 text-sm rounded resize-none focus:outline-none focus:border-black"
            />
          </form>
        </div>

        {/* ORDER SUMMARY */}
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
            onClick={handleCheckout}
            disabled={loading || !cartItems.length || !isValid}
            className={`w-full mt-6 py-3 rounded text-sm ${
              isValid
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
