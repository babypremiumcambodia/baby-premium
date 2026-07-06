import { supabase } from "@/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getProduct(id: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function archiveProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .update({ active: false })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}