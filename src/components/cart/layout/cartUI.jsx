"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/cartContext";

import CartButton from "../cartButton";
import CartDrawer from "../cartDrawer";

const CartUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CartButton count={cartCount} onClick={() => setIsOpen(true)} />
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CartUI;
