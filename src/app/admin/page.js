import { getActiveProducts } from "@/lib/queries/product";
import { getCategories } from "@/lib/queries/category";
import DashboardProduct from "@/components/Admindasboard/DashboardProduct";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <DashboardProduct products={products} categories={categories} />
    </main>
  );
}
