import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useShareIntent } from "expo-share-intent";
import { colors, spacing } from "../src/theme";

function extractFirstUrl(text = "") {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match?.[0] || text;
}

export default function ShareImportScreen() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    async function handleShare() {
      if (!hasShareIntent) return;

      const sharedText =
        shareIntent?.text ||
        shareIntent?.webUrl ||
        shareIntent?.url ||
        "";

      const sharedUrl = extractFirstUrl(sharedText);

      await resetShareIntent();

      router.replace({
        pathname: "/project/import-link",
        params: { sharedUrl },
      });
    }

    handleShare();
  }, [hasShareIntent]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Opening Sewfolio</Text>
        <Text style={styles.text}>Preparing your shared project link.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  title: { color: colors.charcoal, fontSize: 28, fontWeight: "700", marginBottom: spacing.sm },
  text: { color: colors.mutedText, fontSize: 16, textAlign: "center" },
});
