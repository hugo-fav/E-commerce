"use client";

import { ShoppingCart } from "lucide-react";

const CartButton = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center
                 bg-white border border-gray-300 text-gray-900
                 shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                 hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)]
                 transition-shadow"
    >
      <ShoppingCart size={20} />

      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 w-5 h-5
                     flex items-center justify-center
                     bg-black text-white text-[10px]
                     font-medium"
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CartButton;
