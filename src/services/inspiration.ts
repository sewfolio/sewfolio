import { supabase } from "../lib/supabase";

export async function fetchInspirationItems() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("inspiration_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createInspirationItem(item: any) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("inspiration_items")
    .insert([
      {
        user_id: userId,
        title: item.title,
        type: item.type || "note",
        image_url: item.imageUrl || item.image_url || null,
        source_url: item.sourceUrl || item.source_url || null,
        notes: item.notes || null,
        tags: item.tags || [],
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInspirationItem(id: string) {
  const { error } = await supabase
    .from("inspiration_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
