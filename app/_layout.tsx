import { Stack } from "expo-router";
import { SewfolioProvider } from "../src/store/sewfolioStore";

export default function RootLayout() {
  return (
    <SewfolioProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SewfolioProvider>
  );
}
