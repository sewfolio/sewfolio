import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useRootNavigationState, useSegments } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../src/lib/supabase";
import { SewfolioProvider } from "../src/store/sewfolioStore";

const ONBOARDING_KEY = "sewfolio-onboarding-complete";

export default function RootLayout() {
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
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
    async function routeUser() {
      if (!rootNavigationState?.key) return;
      if (session === undefined) return;

      const onboardingComplete =
        (await AsyncStorage.getItem(ONBOARDING_KEY)) === "true";

      const currentRoot = segments[0];
      const inAuth = currentRoot === "auth";
      const inOnboarding = currentRoot === "onboarding";

      if (!session && !inAuth) {
        router.replace("/auth");
        return;
      }

      if (session && !onboardingComplete && !inOnboarding) {
        router.replace("/onboarding");
        return;
      }

      if (session && onboardingComplete && (inAuth || inOnboarding)) {
        router.replace("/splash");
      }
    }

    routeUser();
  }, [session, segments, rootNavigationState?.key]);

  return (
    <SewfolioProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SewfolioProvider>
  );
}
