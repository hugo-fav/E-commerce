"use client";

import { useState } from "react";
import ProductGrid from "./productGrid";
import CategoryFilter from "./categoryFilter";

export default function ProductsClient({ products, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category?.slug === selectedCategory
        );

  return (
    <>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="mt-8">
        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}
