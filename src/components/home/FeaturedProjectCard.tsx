import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../theme";
import { placeholderProject } from "../../utils/placeholders";

export default function FeaturedProjectCard({ project }: { project: any }) {
  if (!project) {
    return (
      <Pressable style={styles.emptyCard} onPress={() => router.push("/project/import-link")}>
        <Text style={styles.emptyTitle}>No projects yet</Text>
        <Text style={styles.emptyText}>Import your first sewing tutorial to start building your library.</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/project/${project.id}`)}>
      <Image source={project.image ? { uri: project.image } : placeholderProject} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.eyebrow}>CONTINUE WORKING</Text>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.meta}>{project.sourceName || "Saved project"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  image: {
    width: "100%",
    height: 230,
    backgroundColor: colors.oatmeal,
  },
  body: {
    padding: spacing.lg,
  },
  eyebrow: {
    color: colors.clay,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.charcoal,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "500",
  },
  meta: {
    color: colors.mutedText,
    fontSize: 15,
    marginTop: spacing.sm,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  emptyTitle: {
    color: colors.charcoal,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
});
