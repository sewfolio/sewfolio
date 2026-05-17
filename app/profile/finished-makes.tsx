import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";
import { placeholderProject } from "../../src/utils/placeholders";
import ScreenShell from "../../src/components/ui/ScreenShell";
import PageHeader from "../../src/components/ui/PageHeader";
import EmptyState from "../../src/components/ui/EmptyState";

export default function FinishedMakesScreen() {
  const { projects } = useSewfolio();
  const finished = projects.filter((project: any) => project.status === "finished");

  return (
    <ScreenShell>
      <PageHeader
        showBack
        eyebrow="Project Archive"
        title="Finished Makes"
        subtitle={`${finished.length} completed project${finished.length === 1 ? "" : "s"}`}
      />

      {finished.length === 0 ? (
        <EmptyState
          title="No finished makes yet"
          text="Mark a project finished and it will appear here."
          actionLabel="View Projects"
          onPress={() => router.push("/(tabs)/explore")}
        />
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.oatmeal,
  },
  body: {
    flex: 1,
    paddingLeft: spacing.md,
    justifyContent: "center",
  },
  title: {
    color: colors.charcoal,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
  },
  meta: {
    color: colors.mutedText,
    fontSize: 14,
    marginTop: 6,
  },
});
