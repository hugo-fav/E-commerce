"use client";

import { useState } from "react";
import CategoryFilter from "../products/categoryFilter";
import DashboardProductGrid from "./DashboardProductGrid";

function DashboardProduct({ products, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) => product.category?.slug === selectedCategory,
        );

  return (
    <>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="mt-8">
        <DashboardProductGrid products={filteredProducts} />
      </div>
    </>
  );
}

export default DashboardProduct;
