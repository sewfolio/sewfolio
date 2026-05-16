import { supabase } from "../lib/supabase";

export async function fetchStashCollections() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("stash_collections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createStashCollection(title: string, tint = "#F3DDD7") {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error("You must be signed in to create a stash collection.");
  }

  const { data, error } = await supabase
    .from("stash_collections")
    .insert([{ title, tint, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function renameStashCollection(id: string, title: string) {
  const { data, error } = await supabase
    .from("stash_collections")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeStashCollection(id: string) {
  const { error } = await supabase
    .from("stash_collections")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
