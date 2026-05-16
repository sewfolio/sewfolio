import { supabase } from "../lib/supabase";

export async function fetchStashItems() {
  const { data, error } = await supabase
    .from("stash_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createStashItem(item: any) {
  const { data, error } = await supabase
    .from("stash_items")
    .insert([
      {
        collection_id: null,
        name: item.name,
        image: item.image || null,
        amount: item.amount || item.yardage || null,
        type: item.type || null,
        color: item.color || null,
        brand: item.brand || null,
        notes: item.notes || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStashItemRecord(id: string, updates: any) {
  const payload: any = {};

  // collection_id requires a Supabase UUID. Local collection IDs are strings for now.
  // Do not sync collection_id until stash_collections are migrated.

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.image !== undefined) payload.image = updates.image;
  if (updates.amount !== undefined) payload.amount = updates.amount;
  if (updates.yardage !== undefined) payload.amount = updates.yardage;
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.color !== undefined) payload.color = updates.color;
  if (updates.brand !== undefined) payload.brand = updates.brand;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from("stash_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeStashItem(id: string) {
  const { error } = await supabase
    .from("stash_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
