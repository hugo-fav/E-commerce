"use client";

import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";

const CartDrawer = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white px-6 py-5 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Close
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty</p>
        ) : (
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li key={item.id} className="flex gap-4 border-b pb-6">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h3 className="text-sm font-medium leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    ₦{item.price.toLocaleString()}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 text-sm hover:bg-gray-100 transition"
                    >
                      −
                    </button>

                    <span className="text-sm">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 border border-gray-300 text-sm hover:bg-gray-100 transition"
                    >
                      +
                      {item.quantity >= item.stock && (
                        <span className=" text-xs text-red-500 m">Max</span>
                      )}
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-400 hover:text-black mt-2 transition"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Shipping & taxes calculated at checkout
            </p>

            <button
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="w-full mt-6 bg-black text-white py-3 text-sm
                         hover:bg-gray-900 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
