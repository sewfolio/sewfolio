import { supabase } from "../lib/supabase";

export async function fetchProjectMaterials(projectId: string) {
  const { data, error } = await supabase
    .from("project_materials")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function replaceProjectMaterials(projectId: string, materials: any[]) {
  const { error: deleteError } = await supabase
    .from("project_materials")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (!materials.length) return [];

  const payload = materials.map((item) => ({
    project_id: projectId,
    name: item.name,
    amount: item.amount || null,
    type: item.type || null,
  }));

  const { data, error } = await supabase
    .from("project_materials")
    .insert(payload)
    .select();

  if (error) throw error;
  return data || [];
}
