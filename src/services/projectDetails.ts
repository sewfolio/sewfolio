import { supabase } from "../lib/supabase";

export async function fetchAllProjectMaterials() {
  const { data, error } = await supabase
    .from("project_materials")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchAllProjectSteps() {
  const { data, error } = await supabase
    .from("project_steps")
    .select("*")
    .order("step_order", { ascending: true });

  if (error) throw error;
  return data || [];
}
