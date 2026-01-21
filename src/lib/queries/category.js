import { supabase } from "@/lib/supabaseClient";

export async function createNewCategory({ name, slug } = {}) {
  if (!name) {
    throw new Error("Missing category name");
  }

  const finalSlug =
    (slug && String(slug).trim()) ||
    String(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
    })
    .select()
    .single();

  if (categoryError) {
    console.error("Error creating category:", categoryError);
    throw categoryError;
  }

  return category;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) throw error;
  return data;
}
