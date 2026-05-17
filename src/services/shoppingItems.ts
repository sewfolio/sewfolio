import { supabase } from "../lib/supabase";

export async function fetchShoppingItems(projectId?: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) return [];

  let query = supabase
    .from("shopping_items")
    .select("*")
    .eq("user_id", userId)
    .order("purchased", { ascending: true })
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createShoppingItem(item: any) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("shopping_items")
    .insert([
      {
        user_id: userId,
        project_id: item.projectId || item.project_id || null,
        name: item.name,
        quantity: item.quantity || null,
        category: item.category || null,
        purchased: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShoppingItem(id: string, updates: any) {
  const { data, error } = await supabase
    .from("shopping_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShoppingItem(id: string) {
  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
