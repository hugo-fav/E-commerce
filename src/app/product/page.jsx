import { getActiveProducts } from "@/lib/queries/product";
import { getCategories } from "@/lib/queries/category";

import ProductsClient from "@/components/products/productClient";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <div className="mb-10">
        <h1 className="text-2xl font-medium uppercase">All Products</h1>
        <p className="text-sm text-gray-500">Browse our complete collection</p>
      </div>

      <ProductsClient products={products} categories={categories} />
    </main>
  );
}
