import { supabase } from "../lib/supabase";

const IMPORT_PROJECT_URL =
  "https://axaqrmecztqrsqpennau.functions.supabase.co/import-project";

export async function importProjectFromUrl(url: string) {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  const response = await fetch(IMPORT_PROJECT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
    },
    body: JSON.stringify({ url }),
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    console.log("Import function response", json);
    throw new Error(json.error || "Import failed");
  }

  return json.project;
}
