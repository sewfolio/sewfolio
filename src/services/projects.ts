import { supabase } from "../lib/supabase";

export async function fetchProjects() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProject(project: any) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error("You must be signed in to create a project.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: userId,
        title: project.title,
        workbook_id: project.workbookId || project.workbook_id || null,
        source_url: project.sourceUrl || project.source_url || null,
        source_name: project.sourceName || project.source_name || null,
        hero_image: project.image || project.heroImage || project.hero_image || null,
        description: project.description || null,
        difficulty: project.difficulty || null,
        estimated_time: project.estimatedTime || project.estimated_time || null,
        notes: project.notes || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProjectRecord(id: string, updates: any) {
  const payload: any = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.workbookId !== undefined) payload.workbook_id = updates.workbookId;
  if (updates.sourceUrl !== undefined) payload.source_url = updates.sourceUrl;
  if (updates.sourceName !== undefined) payload.source_name = updates.sourceName;
  if (updates.image !== undefined) payload.hero_image = updates.image;
  if (updates.heroImage !== undefined) payload.hero_image = updates.heroImage;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.difficulty !== undefined) payload.difficulty = updates.difficulty;
  if (updates.estimatedTime !== undefined) payload.estimated_time = updates.estimatedTime;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeProject(id: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
