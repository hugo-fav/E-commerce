import { supabase } from "../supabaseClient";

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq("is_active", true);

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data;
}

export async function getRelatedProducts(categoryId, currentProductId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

export async function createProduct(product) {
  const { error } = await supabase.from("products").insert([product]);

  if (error) throw error;
}

export async function updateProduct(id, updates) {
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProduct(productId) {
  if (productId == null) throw new Error("Missing product id");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
  return true;
}
