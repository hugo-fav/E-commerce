import CartUI from "@/components/cart/layout/cartUI";
import { CartProvider } from "@/context/cartContext";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function StoreLayout({ children }) {
  return (
    <>
      <CartProvider>
        {/* Global centered shell */}
        <div className="flex-1 max-w-6xl mx-auto  px-6 sm:px-8 lg:px-12 w-full py-8 ">
          {/* Global Navbar (constrained) */}
          <Navbar />

          {/* Page content */}
          <main>{children}</main>
        </div>

        {/* Footer (same width rhythm, slightly different bg already handled) */}
        <Footer />

        {/* Cart Overlay */}
        <CartUI />
      </CartProvider>
    </>
  );
}
