import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import { useSewfolio } from "../store/sewfolioStore";
import { placeholderProject } from "../utils/placeholders";
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
        <NavIcon type="home" />
        <Text style={styles.navItem}>Home</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/explore")} style={styles.navButton}>
        <NavIcon type="projects" active />
        <Text style={styles.navItemActive}>Projects</Text>
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

function WorkbookCard({ item, count }: any) {
  return (
    <Pressable
      style={[styles.workbookCard, { backgroundColor: item.tint }]}
      onPress={() => router.push(`/workbooks/${item.id}`)}
    >
      <Text style={styles.workbookTitle}>{item.title}</Text>
      <Text style={styles.workbookMeta}>{count} saved projects</Text>
    </Pressable>
  );
}

function SavedProjectCard({ item }: any) {
  return (
    <Pressable style={styles.projectCard} onPress={() => router.push(`/project/${item.id}`)}>
      <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.projectImage} />
      <View style={styles.projectBody}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectMeta}>{item.pattern || "Saved project"} · {item.fabric || "No fabric selected"}</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{item.category || "Saved"}</Text>
          {item.sourceUrl ? <Text style={styles.tag}>Online</Text> : <Text style={styles.tag}>Manual</Text>}
        </View>
      </View>
    </Pressable>
  );
}

export default function SewfolioProjectsScreen() {
  const { projects, workbooks } = useSewfolio();
  const [query, setQuery] = useState("");

  const filteredProjects = projects.filter((project: any) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Project Library</Text>
            <Text style={styles.heading}>Workbooks</Text>
          </View>

          <Pressable onPress={() => router.push("/project/import-link")} style={styles.headerAdd}>
            <Text style={styles.headerAddText}>+</Text>
          </Pressable>
        </View>

        <TextInput
          placeholder="Search saved projects"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.actionCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Save an online project</Text>
            <Text style={styles.actionBody}>Paste a pattern, blog, video, or Pinterest link into your project library.</Text>
          </View>
          <Pressable onPress={() => router.push("/project/import-link")} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Workbooks</Text>
          <Pressable onPress={() => router.push("/workbooks/customize")}><Text style={styles.seeAll}>Customize</Text></Pressable>
        </View>

        <View style={styles.workbookGrid}>
          {workbooks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Create your first workbook</Text>
              <Text style={styles.emptyText}>Organize patterns, tutorials, gifts, and makes into custom workbooks.</Text>
            </View>
          ) : workbooks.map((item: any) => {
            const count = projects.filter((project: any) => project.workbookId === item.id).length;
            return <WorkbookCard key={item.id} item={item} count={count} />;
          })}
        </View>

        <View style={styles.sectionHeaderLarge}>
          <Text style={styles.sectionTitle}>Recently Saved</Text>
          <Text style={styles.count}>{filteredProjects.length} projects</Text>
        </View>

        {filteredProjects.map((item: any) => (
          <SavedProjectCard key={item.id} item={item} />
        ))}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 130 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
  heading: { fontSize: 34, color: colors.charcoal, fontWeight: "400" },
  headerAdd: { width: 48, height: 48, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  headerAddText: { color: colors.white, fontSize: 30, lineHeight: 34 },

  search: {
    height: 50,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },

  actionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.soft,
  },
  actionTitle: { fontSize: 18, color: colors.charcoal, fontWeight: "500" },
  actionBody: { fontSize: 13, color: colors.mutedText, lineHeight: 19, marginTop: 4 },
  actionButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.round, backgroundColor: colors.sage },
  actionButtonText: { color: colors.white, fontSize: 14, fontWeight: "600" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionHeaderLarge: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md, marginTop: spacing.xl },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  seeAll: { fontSize: 13, color: colors.olive },
  count: { fontSize: 13, color: colors.mutedText },

  workbookGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  workbookCard: {
    width: "47.8%",
    minHeight: 112,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  emptyTitle: {
    color: colors.charcoal,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  workbookTitle: { fontSize: 19, color: colors.charcoal, fontWeight: "500", lineHeight: 24 },
  workbookMeta: { fontSize: 12, color: colors.mutedText },

  projectCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  projectImage: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  projectBody: { flex: 1, marginLeft: spacing.md, justifyContent: "space-between" },
  projectTitle: { fontSize: 17, color: colors.charcoal, fontWeight: "500" },
  projectMeta: { fontSize: 12, color: colors.mutedText, lineHeight: 18 },
  tagRow: { flexDirection: "row", gap: spacing.sm },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    color: colors.charcoal,
    fontSize: 11,
    overflow: "hidden",
  },

  bottomNav: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    height: 82,
    borderRadius: 30,
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "#E8DDD3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  navButton: { alignItems: "center", justifyContent: "center", minWidth: 58, gap: 3 },
  navItem: { fontSize: 11, color: colors.charcoal },
  navItemActive: { fontSize: 11, color: colors.clay, fontWeight: "600" },
  addButton: {
    width: 62,
    height: 62,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
    borderWidth: 5,
    borderColor: "#FFFDF9",
  },
  addText: { color: colors.white, fontSize: 34, lineHeight: 38 },
});
