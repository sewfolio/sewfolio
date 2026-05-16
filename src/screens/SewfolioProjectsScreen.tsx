import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import HomeIcon from "../../assets/icons/home.svg";
import ProjectsIcon from "../../assets/icons/projects.svg";
import StashIcon from "../../assets/icons/stash.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import { projects } from "../data/mockData";

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress}%` }]} />
    </View>
  );
}


function NavIcon({ type, active = false }: { type: string; active?: boolean }) {
  const color = active ? colors.clay : colors.sage;
  const size = 28;

  if (type === "home") return <HomeIcon width={size} height={size} color={color} />;
  if (type === "projects") return <ProjectsIcon width={size} height={size} color={color} />;
  if (type === "stash") return <StashIcon width={size} height={size} color={color} />;
  if (type === "profile") return <ProfileIcon width={size} height={size} color={color} />;

  return null;
}

function ProjectCard({ item }: any) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/project/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.status}>{item.status} · Last edited today</Text>
          </View>
          <Text style={styles.percent}>{item.progress}%</Text>
        </View>

        <Text style={styles.meta}>Pattern: Estuary Dress · Fabric: Washed linen</Text>
        <ProgressBar progress={item.progress} />
      </View>
    </Pressable>
  );
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

      <Pressable style={styles.addButton} onPress={() => router.push("/project/new")}>
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

export default function SewfolioProjectsScreen() {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter || project.status === filter);

  const featured = filteredProjects[0] || projects[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Project Library</Text>
            <Text style={styles.heading}>Projects</Text>
          </View>

          <Pressable onPress={() => router.push("/project/new")} style={styles.headerAdd}>
            <Text style={styles.headerAddText}>+</Text>
          </Pressable>
        </View>

        <TextInput
          placeholder="Search projects, patterns, fabrics"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {["All", "In Progress", "Planning", "Finished", "On Hold"].map((item) => (
              <Pressable key={item} onPress={() => setFilter(item)}>
                <Text style={filter === item ? styles.chipActive : styles.chip}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filter === "All" && (
          <Pressable style={styles.featuredCard} onPress={() => router.push(`/project/${featured.id}`)}>
            <Image source={{ uri: featured.image }} style={styles.featuredImage} />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredEyebrow}>Current WIP</Text>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <Text style={styles.featuredMeta}>{featured.status} · {featured.progress}% complete</Text>
              <ProgressBar progress={featured.progress} />
            </View>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Projects</Text>
          <Text style={styles.count}>{filteredProjects.length} shown</Text>
        </View>

        {filteredProjects.map((item) => (
          <ProjectCard key={item.title} item={item} />
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

  chips: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, color: colors.charcoal, fontSize: 13 },
  chipActive: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage, color: colors.white, fontSize: 13 },

  featuredCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  featuredImage: { width: "100%", height: 150, backgroundColor: colors.oatmeal },
  featuredContent: { padding: spacing.lg },
  featuredEyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
  featuredTitle: { fontSize: 24, color: colors.charcoal, fontWeight: "500" },
  featuredMeta: { fontSize: 14, color: colors.mutedText, marginTop: 4, marginBottom: spacing.md },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  count: { fontSize: 13, color: colors.mutedText },

  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: { width: 82, height: 82, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  cardContent: { flex: 1, marginLeft: spacing.md, justifyContent: "space-between" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  title: { fontSize: 17, color: colors.charcoal, fontWeight: "500" },
  status: { fontSize: 12, color: colors.clay, marginTop: 2 },
  meta: { fontSize: 12, color: colors.mutedText, marginVertical: spacing.sm },
  percent: { fontSize: 13, color: colors.charcoal },

  track: { height: 5, backgroundColor: colors.oatmeal, borderRadius: radius.round, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.sage },

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
  navIcon: { fontSize: 22, color: colors.sage },
  navIconActive: { fontSize: 22, color: colors.clay },
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
