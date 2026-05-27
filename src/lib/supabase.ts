import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://axaqrmecztqrsqpennau.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4YXFybWVjenRxcnNxcGVubmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTI4MDgsImV4cCI6MjA5NDQ2ODgwOH0.qhK-SNykhx6hYKh9E_fQ3YKl2lYWZPo-QTtNG8D7ao8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
