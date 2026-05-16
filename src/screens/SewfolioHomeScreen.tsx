import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import { useSewfolio } from "../store/sewfolioStore";
import { placeholderProject, placeholderFabric } from "../utils/placeholders";

export default function SewfolioHomeScreen() {
  const { projects, fabrics } = useSewfolio();
  const featured = projects[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Sewfolio</Text>
        <Text style={styles.subtitle}>Your sewing projects, stash, and ideas in one place.</Text>

        {featured ? (
          <Pressable style={styles.heroCard} onPress={() => router.push(`/project/${featured.id}`)}>
            <Image source={featured.image ? { uri: featured.image } : placeholderProject} style={styles.heroImage} />
            <View style={styles.heroContent}>
              <Text style={styles.eyebrow}>Continue Working</Text>
              <Text style={styles.heroTitle}>{featured.title}</Text>
              <Text style={styles.heroMeta}>{featured.sourceName || "Saved project"}</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable style={styles.heroCard} onPress={() => router.push("/project/import-link")}>
            <Image source={placeholderProject} style={styles.heroImage} />
            <View style={styles.heroContent}>
              <Text style={styles.eyebrow}>Start Here</Text>
              <Text style={styles.heroTitle}>Save your first sewing project</Text>
              <Text style={styles.heroMeta}>Import a tutorial, pattern, or idea from a link.</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Projects</Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.savedRow}>
          {projects.length === 0 ? (
            <Pressable style={styles.emptyCard} onPress={() => router.push("/project/import-link")}>
              <Text style={styles.emptyTitle}>No saved projects yet</Text>
              <Text style={styles.emptyText}>Import a sewing tutorial or save your first project.</Text>
            </Pressable>
          ) : (
            projects.map((item: any) => (
              <Pressable key={item.id} style={styles.savedCard} onPress={() => router.push(`/project/${item.id}`)}>
                <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.savedImage} />
                <Text style={styles.savedLabel} numberOfLines={1}>{item.title}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stash Snapshot</Text>
          <Pressable onPress={() => router.push("/(tabs)/stash")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.savedRow}>
          {fabrics.length === 0 ? (
            <Pressable style={styles.emptyCard} onPress={() => router.push("/fabric/new")}>
              <Text style={styles.emptyTitle}>No stash saved yet</Text>
              <Text style={styles.emptyText}>Add fabric, notions, scraps, bundles, and photos.</Text>
            </Pressable>
          ) : (
            fabrics.slice(0, 6).map((item: any) => (
              <Pressable key={item.id} style={styles.savedCard} onPress={() => router.push(`/fabric/${item.id}`)}>
                <Image source={item.image ? { uri: item.image } : placeholderFabric} style={styles.savedImage} />
                <Text style={styles.savedLabel} numberOfLines={1}>{item.name}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 50 },
  logo: { fontSize: 42, color: colors.charcoal, fontWeight: "500" },
  subtitle: { fontSize: 15, color: colors.mutedText, lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.xl },

  heroCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.xl, ...shadows.soft },
  heroImage: { width: "100%", height: 230, backgroundColor: colors.oatmeal },
  heroContent: { padding: spacing.lg },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 },
  heroTitle: { color: colors.charcoal, fontSize: 27, fontWeight: "500", lineHeight: 33 },
  heroMeta: { color: colors.mutedText, fontSize: 14, marginTop: spacing.sm },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  sectionTitle: { color: colors.charcoal, fontSize: 21, fontWeight: "500" },
  seeAll: { color: colors.clay, fontSize: 14, fontWeight: "600" },

  savedRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.xl },
  savedCard: { width: "47%", backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  savedImage: { width: "100%", height: 120, backgroundColor: colors.oatmeal },
  savedLabel: { color: colors.charcoal, fontSize: 14, fontWeight: "500", padding: spacing.md },

  emptyCard: { width: "100%", backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  emptyTitle: { color: colors.charcoal, fontSize: 17, fontWeight: "600", marginBottom: 6 },
  emptyText: { color: colors.mutedText, fontSize: 14, lineHeight: 20 },
});
