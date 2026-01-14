import Navbar from "@/components/navbar";
import ProductGrid from "@/components/products/productGrid";
import TestimonialSection from "@/components/testimonial";
// import { products } from "@/lib/data";
import { getActiveProducts } from "@/lib/queries/product";
import Link from "next/link";

export default async function HomePage() {
  const products = await getActiveProducts();
  return (
    <main>
      {/* Hero / Header Section */}
      <section className="mb-7 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Everyday Essentials, Elevated
        </h1>

        <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed">
          Carefully curated products designed for quality, comfort, and everyday
          use. Shop with confidence and enjoy a seamless shopping experience.
        </p>
      </section>

      <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        {[
          "Fast Delivery",
          "Secure Payments",
          "Quality Guaranteed",
          // "24/7 Customer Support",
        ].map((item, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 text-gray-600 text-center"
          >
            {item}
          </div>
        ))}
      </section>

      {/* Products Grid */}
      <section className="mt-8">
        <ProductGrid products={products} />
      </section>

      <section className="mt-20 text-center max-w-xl mx-auto">
        <h3 className="text-2xl font-medium">Can’t decide?</h3>
        <p className="mt-3 text-sm text-gray-500">
          Browse our full collection and find something perfect for you.
        </p>
        <Link
          href="/product"
          className="inline-block mt-3 text-sm font-medium uppercase tracking-wide border-b border-black hover:opacity-70 transition"
        >
          View All Products
        </Link>
      </section>

      <TestimonialSection />
    </main>
  );
}
