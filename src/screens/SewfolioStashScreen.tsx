import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import { fabrics } from "../data/mockData";
import HomeIcon from "../../assets/icons/home.svg";
import ProjectsIcon from "../../assets/icons/projects.svg";
import StashIcon from "../../assets/icons/stash.svg";
import ProfileIcon from "../../assets/icons/profile.svg";

function NavIcon({ type, active = false }: { type: string; active?: boolean }) {
  const color = active ? colors.clay : colors.sage;
  const size = 28;

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
        <NavIcon type="projects" />
        <Text style={styles.navItem}>Projects</Text>
      </Pressable>

      <Pressable style={styles.addButton} onPress={() => router.push("/project/new")}>
        <Text style={styles.addText}>+</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/stash")} style={styles.navButton}>
        <NavIcon type="stash" active />
        <Text style={styles.navItemActive}>Stash</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.navButton}>
        <NavIcon type="profile" />
        <Text style={styles.navItem}>Profile</Text>
      </Pressable>
    </View>
  );
}

export default function SewfolioStashScreen() {
  const [filter, setFilter] = useState("All");

  const filteredFabrics =
    filter === "All"
      ? fabrics
      : fabrics.filter((item: any) =>
          item.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Material Library</Text>
            <Text style={styles.heading}>Fabric Stash</Text>
          </View>

          <Pressable style={styles.headerAdd} onPress={() => router.push("/fabric/new")}>
            <Text style={styles.headerAddText}>+</Text>
          </Pressable>
        </View>

        <TextInput
          placeholder="Search fabrics, colors, yardage"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Fabrics</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42.5</Text>
            <Text style={styles.statLabel}>Yards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Low stock</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {["All", "Cotton", "Linen", "Wool", "Silk", "Quilting"].map((item) => (
              <Pressable key={item} onPress={() => setFilter(item)}>
                <Text style={filter === item ? styles.chipActive : styles.chip}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filter === "All" && (
          <View style={styles.featuredCard}>
            <View style={styles.featuredText}>
              <Text style={styles.featuredEyebrow}>Stash Snapshot</Text>
              <Text style={styles.featuredTitle}>Washed linen is ready for your next project.</Text>
              <Text style={styles.featuredMeta}>3.0 yards available · Oatmeal</Text>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {filter === "All" ? "All Fabric" : `${filter} Fabric`}
          </Text>
          <Text style={styles.count}>{filteredFabrics.length} shown</Text>
        </View>

        <View style={styles.grid}>
          {filteredFabrics.map((item) => (
            <Pressable key={item.name} style={styles.card} onPress={() => router.push(`/fabric/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.yardage}>{item.yardage}</Text>
                <Text style={styles.meta}>Neutral · Garment weight</Text>
              </View>
            </Pressable>
          ))}
        </View>
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

  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  statNumber: { fontSize: 21, color: colors.charcoal, fontWeight: "500" },
  statLabel: { fontSize: 11, color: colors.mutedText, marginTop: 3 },

  chips: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, color: colors.charcoal, fontSize: 13 },
  chipActive: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage, color: colors.white, fontSize: 13 },

  featuredCard: {
    backgroundColor: "#F3DDD7",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  featuredText: { maxWidth: "92%" },
  featuredEyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 },
  featuredTitle: { fontSize: 21, color: colors.charcoal, fontWeight: "500", lineHeight: 27 },
  featuredMeta: { fontSize: 14, color: colors.mutedText, marginTop: spacing.sm },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  count: { fontSize: 13, color: colors.mutedText },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card: {
    width: "47.8%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.soft,
  },
  image: { width: "100%", height: 130, backgroundColor: colors.oatmeal },
  cardBody: { padding: spacing.md },
  title: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  yardage: { fontSize: 13, color: colors.clay, marginTop: 3 },
  meta: { fontSize: 12, color: colors.mutedText, marginTop: 6 },

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
