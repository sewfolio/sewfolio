import { supabase } from "../lib/supabase";

export async function fetchProjectSteps(projectId: string) {
  const { data, error } = await supabase
    .from("project_steps")
    .select("*")
    .eq("project_id", projectId)
    .order("step_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function replaceProjectSteps(projectId: string, steps: any[]) {
  const { error: deleteError } = await supabase
    .from("project_steps")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw deleteError;

  if (!steps.length) return [];

  const payload = steps.map((step, index) => ({
    project_id: projectId,
    step_order: index + 1,
    text: typeof step === "string" ? step : step.text,
  }));

  const { data, error } = await supabase
    .from("project_steps")
    .insert(payload)
    .select();

  if (error) throw error;
  return data || [];
}
