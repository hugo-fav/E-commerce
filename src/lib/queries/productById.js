import { supabase } from "../supabaseClient";

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,images,categories(name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
