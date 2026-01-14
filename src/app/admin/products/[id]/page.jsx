import ProductForm from "@/components/Admindasboard/Productform";
import { getProductById } from "@/lib/queries/product";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  if (!id) return <p>Product ID not found</p>;

  let product;
  try {
    product = await getProductById(id);
  } catch (err) {
    console.error("Error fetching product:", err);
    return <p>Product not found</p>;
  }

  if (!product) return <p>Product not found</p>;

  return <ProductForm initialData={product} />;
}
