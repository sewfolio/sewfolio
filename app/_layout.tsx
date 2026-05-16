import React, { useEffect, useState } from "react";
import { Stack, router, useSegments } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../src/lib/supabase";
import { SewfolioProvider } from "../src/store/sewfolioStore";

export default function RootLayout() {
  const segments = useSegments();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    const inAuthGroup = segments[0] === "auth";

    if (!session && !inAuthGroup) {
      router.replace("/auth");
    }

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, segments]);

  return (
    <SewfolioProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SewfolioProvider>
  );
}
