import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";
import { placeholderProject } from "../../src/utils/placeholders";

export default function FinishedMakesScreen() {
  const { projects } = useSewfolio();
  const finished = projects.filter((project: any) => project.status === "finished");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>PROJECT ARCHIVE</Text>
        <Text style={styles.heading}>Finished Makes</Text>

        {finished.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No finished makes yet</Text>
            <Text style={styles.emptyText}>Mark a project finished and it will appear here.</Text>
          </View>
        ) : (
          finished.map((item: any) => (
            <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/project/${item.id}`)}>
              <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.image} />
              <View style={styles.body}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.sourceName || "Finished project"}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 80 },
  back: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  backText: { fontSize: 38, color: colors.charcoal, marginTop: -4 },
  eyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2.4, fontWeight: "700", marginBottom: 8 },
  heading: { color: colors.charcoal, fontSize: 44, fontWeight: "400", marginBottom: spacing.xl },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  emptyTitle: { color: colors.charcoal, fontSize: 23, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: { width: 92, height: 92, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  body: { flex: 1, paddingLeft: spacing.md, justifyContent: "center" },
  title: { color: colors.charcoal, fontSize: 20, lineHeight: 25, fontWeight: "600" },
  meta: { color: colors.mutedText, fontSize: 14, marginTop: 6 },
});
