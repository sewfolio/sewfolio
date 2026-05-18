import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import { useSewfolio } from "../store/sewfolioStore";
import { placeholderProject, placeholderFabric } from "../utils/placeholders";
import QuickActions from "../components/home/QuickActions";

import HomeIcon from "../../assets/icons/home.svg";
import ProjectsIcon from "../../assets/icons/projects.svg";
import StashIcon from "../../assets/icons/stash.svg";
import ProfileIcon from "../../assets/icons/profile.svg";

function NavIcon({ type, active = false }: { type: string; active?: boolean }) {
  const color = active ? colors.clay : colors.sage;
  const size = 34;

  if (type === "home") return <HomeIcon width={size} height={size} color={color} />;
  if (type === "projects") return <ProjectsIcon width={size} height={size} color={color} />;
  if (type === "stash") return <StashIcon width={size} height={size} color={color} />;
  if (type === "profile") return <ProfileIcon width={size} height={size} color={color} />;

  return null;
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Pressable onPress={() => router.push("/(tabs)")} style={styles.navButton}>
        <NavIcon type="home" active />
        <Text style={styles.navItemActive}>Home</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/explore")} style={styles.navButton}>
        <NavIcon type="projects" />
        <Text style={styles.navItem}>Projects</Text>
      </Pressable>

      <Pressable style={styles.addButton} onPress={() => router.push("/project/import-link")}>
        <Text style={styles.addText}>+</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/stash")} style={styles.navButton}>
        <NavIcon type="stash" />
        <Text style={styles.navItem}>Stash</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.navButton}>
        <NavIcon type="profile" />
        <Text style={styles.navItem}>Profile</Text>
      </Pressable>
    </View>
  );
}

export default function SewfolioHomeScreen() {
  const { projects, fabrics, workbooks } = useSewfolio();
  const featured = projects[0];
  const firstFabric = fabrics[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>SEWFOLIO HOME</Text>
            <Text style={styles.heading}>Dashboard</Text>
          </View>

          <Image source={require("../../assets/images/sewfolio-mark.png")} style={styles.mark} />
        </View>

        <QuickActions />

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{projects.length}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{fabrics.length}</Text>
            <Text style={styles.statLabel}>Fabrics</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{workbooks.length}</Text>
            <Text style={styles.statLabel}>Workbooks</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Project</Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {featured ? (
          <Pressable style={styles.featuredCard} onPress={() => router.push(`/project/${featured.id}`)}>
            <Image source={featured.image ? { uri: featured.image } : placeholderProject} style={styles.featuredImage} />
            <View style={styles.featuredBody}>
              <Text style={styles.cardEyebrow}>CONTINUE WORKING</Text>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredMeta}>{featured.sourceName || "Saved project"}</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable style={styles.emptyCard} onPress={() => router.push("/project/import-link")}>
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptyText}>Import your first sewing tutorial to start building your library.</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Saved</Text>
          <Text style={styles.count}>{projects.length} saved</Text>
        </View>

        {projects.slice(0, 3).map((item: any) => (
          <Pressable key={item.id} style={styles.projectRow} onPress={() => router.push(`/project/${item.id}`)}>
            <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.rowImage} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.rowMeta}>{item.sourceName || "Saved project"} · {item.fabric || "No fabric selected"}</Text>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>Saved</Text>
                {item.sourceUrl ? <Text style={styles.tag}>Online</Text> : null}
              </View>
            </View>
          </Pressable>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stash Snapshot</Text>
          <Pressable onPress={() => router.push("/stash")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {firstFabric ? (
          <Pressable style={styles.stashCard} onPress={() => router.push(`/fabric/${firstFabric.id}`)}>
            <Text style={styles.cardEyebrow}>STASH SNAPSHOT</Text>
            <Text style={styles.stashTitle}>{firstFabric.name} is ready for your next project.</Text>
            <Text style={styles.stashMeta}>{firstFabric.amount || "Unknown amount"} available</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.stashCard} onPress={() => router.push("/fabric/new")}>
            <Text style={styles.cardEyebrow}>STASH SNAPSHOT</Text>
            <Text style={styles.stashTitle}>Build your fabric stash library.</Text>
            <Text style={styles.stashMeta}>Add fabric photos, yardage, brands, and notes.</Text>
          </Pressable>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 96, paddingHorizontal: spacing.lg },

  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  eyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2.5, fontWeight: "700", marginBottom: 8 },
  heading: { color: colors.charcoal, fontSize: 44, fontWeight: "400", letterSpacing: -1 },
  mark: { width: 78, height: 78, resizeMode: "contain" },

  importCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg, ...shadows.soft },
  importTitle: { color: colors.charcoal, fontSize: 22, fontWeight: "600", marginBottom: 6 },
  importText: { color: colors.mutedText, fontSize: 15, lineHeight: 22, maxWidth: 240 },
  importButton: { backgroundColor: colors.sage, borderRadius: radius.round, paddingHorizontal: 20, paddingVertical: 12 },
  importButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },

  statRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: "center", paddingVertical: spacing.md },
  statNumber: { color: colors.charcoal, fontSize: 30, fontWeight: "400" },
  statLabel: { color: colors.mutedText, fontSize: 13, marginTop: 4 },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { color: colors.charcoal, fontSize: 26, fontWeight: "500" },
  seeAll: { color: colors.clay, fontSize: 15, fontWeight: "700" },
  count: { color: colors.mutedText, fontSize: 15 },

  featuredCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg, ...shadows.soft },
  featuredImage: { width: "100%", height: 230, backgroundColor: colors.oatmeal },
  featuredBody: { padding: spacing.lg },
  cardEyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2, fontWeight: "700", marginBottom: spacing.sm },
  featuredTitle: { color: colors.charcoal, fontSize: 28, lineHeight: 34, fontWeight: "500" },
  featuredMeta: { color: colors.mutedText, fontSize: 15, marginTop: spacing.sm },

  emptyCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.lg },
  emptyTitle: { color: colors.charcoal, fontSize: 24, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },

  projectRow: { flexDirection: "row", backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, ...shadows.soft },
  rowImage: { width: 92, height: 92, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  rowBody: { flex: 1, paddingLeft: spacing.md, justifyContent: "center" },
  rowTitle: { color: colors.charcoal, fontSize: 20, lineHeight: 25, fontWeight: "600" },
  rowMeta: { color: colors.mutedText, fontSize: 14, marginTop: 5 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: spacing.sm },
  tag: { overflow: "hidden", backgroundColor: colors.cream, color: colors.charcoal, borderRadius: radius.round, paddingHorizontal: 13, paddingVertical: 5, fontSize: 12 },

  stashCard: { backgroundColor: "#F3DDD7", borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.lg },
  stashTitle: { color: colors.charcoal, fontSize: 25, lineHeight: 32, fontWeight: "500" },
  stashMeta: { color: colors.mutedText, fontSize: 16, marginTop: spacing.md },

  bottomNav: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 26,
    height: 82,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...shadows.soft,
  },
  navButton: { alignItems: "center", justifyContent: "center", minWidth: 58, gap: 3 },
  navItem: { fontSize: 11, color: colors.charcoal },
  navItemActive: { fontSize: 11, color: colors.clay, fontWeight: "600" },
  addButton: {
    width: 76,
    height: 76,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
    borderWidth: 6,
    borderColor: colors.cream,
    ...shadows.soft,
  },
  addText: { color: colors.white, fontSize: 34, lineHeight: 38 },
});
