import { supabase } from "../lib/supabase";

export async function fetchWorkbooks() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("workbooks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createWorkbook(title: string, tint = "#F3DDD7") {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error("You must be signed in to create a workbook.");
  }

  const { data, error } = await supabase
    .from("workbooks")
    .insert([{ title, tint, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function renameWorkbook(id: string, title: string) {
  const { data, error } = await supabase
    .from("workbooks")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeWorkbook(id: string) {
  const { error } = await supabase
    .from("workbooks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
