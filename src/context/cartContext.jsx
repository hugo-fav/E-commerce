"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      // ❌ No stock at all
      if (product.stock <= 0) return prev;

      // ✅ If product already in cart
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        // ❌ Prevent exceeding stock
        if (newQuantity > product.stock) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }

        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      // ❌ Quantity requested > stock
      if (quantity > product.stock) {
        return [...prev, { ...product, quantity: product.stock }];
      }

      // ✅ Add new product
      return [...prev, { ...product, quantity }];
    });
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;

          // ❌ Below 1
          if (newQuantity < 1) return null;

          // ❌ Above stock
          if (newQuantity > item.stock) {
            return { ...item, quantity: item.stock };
          }

          return { ...item, quantity: newQuantity };
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount,
        subtotal,
        clearCart: () => setCartItems([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
