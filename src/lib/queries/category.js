import { supabase } from "@/lib/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) throw error;
  return data;
}
