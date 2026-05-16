import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";

export async function uploadImageToStorage(uri: string, folder = "uploads") {
  if (!uri || uri.startsWith("http")) {
    console.log("Skipping upload, already remote or empty:", uri);
    return uri;
  }

  console.log("Uploading local image:", uri);

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error("You must be signed in to upload images.");
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });

  const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
  const contentType =
    fileExt === "png"
      ? "image/png"
      : fileExt === "webp"
      ? "image/webp"
      : "image/jpeg";

  const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("sewfolio-images")
    .upload(fileName, decode(base64), {
      contentType,
      upsert: true,
    });

  if (error) {
    console.log("Storage upload error:", error);
    throw error;
  }

  console.log("Storage upload success:", fileName);

  const { data } = supabase.storage
    .from("sewfolio-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
