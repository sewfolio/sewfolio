import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";

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
        <NavIcon type="stash" />
        <Text style={styles.navItem}>Stash</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.navButton}>
        <NavIcon type="profile" active />
        <Text style={styles.navItemActive}>Profile</Text>
      </Pressable>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Profile</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>

          <Text style={styles.name}>Megan</Text>
          <Text style={styles.handle}>@sewfolioapp</Text>

          <Text style={styles.bio}>
            Garment sewing, quilted bags, fabric collecting, and projects that actually get finished.
          </Text>

          <View style={styles.tags}>
            <Text style={styles.tag}>Garments</Text>
            <Text style={styles.tag}>Bags</Text>
            <Text style={styles.tag}>Quilting</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>WIPs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Finished</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Workspace</Text>

          <Pressable style={styles.row} onPress={() => router.push("/profile/inspiration")}>
            <View>
              <Text style={styles.rowTitle}>Saved inspiration</Text>
              <Text style={styles.rowSub}>Photos, links, screenshots, and ideas</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.row} onPress={() => router.push("/profile/shopping-list")}>
            <View>
              <Text style={styles.rowTitle}>Shopping list</Text>
              <Text style={styles.rowSub}>Materials and notions to buy</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.row} onPress={() => router.push("/profile/finished-makes")}>
            <View>
              <Text style={styles.rowTitle}>Finished makes</Text>
              <Text style={styles.rowSub}>Your completed project archive</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.rowLast} onPress={() => router.push("/profile/pattern-library")}>
            <View>
              <Text style={styles.rowTitle}>Pattern library</Text>
              <Text style={styles.rowSub}>Saved PDFs, notes, and pattern info</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Pressable style={styles.row} onPress={() => router.push("/profile/edit-profile")}>
            <Text style={styles.rowTitle}>Edit profile</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.row} onPress={() => router.push("/profile/settings")}>
            <Text style={styles.rowTitle}>Settings</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.row} onPress={() => router.push("/profile/help")}>
            <Text style={styles.rowTitle}>Help</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.rowLast} onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.signOut}>Sign out</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 60 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  spacer: { width: 44 },
  heading: { fontSize: 34, color: colors.charcoal, fontWeight: "400" },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: 42, fontWeight: "400" },
  name: { fontSize: 30, color: colors.charcoal, fontWeight: "500" },
  handle: { fontSize: 15, color: colors.clay, marginTop: 4 },
  bio: {
    fontSize: 15,
    color: colors.mutedText,
    lineHeight: 22,
    textAlign: "center",
    marginTop: spacing.md,
  },
  tags: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.charcoal,
    fontSize: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  statNumber: { fontSize: 24, color: colors.charcoal, fontWeight: "500" },
  statLabel: { fontSize: 12, color: colors.mutedText, marginTop: 3 },

  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.charcoal,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLast: {
    paddingTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitle: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  rowSub: { fontSize: 12, color: colors.mutedText, marginTop: 3 },
  chevron: { fontSize: 24, color: colors.linen },
  signOut: { fontSize: 16, color: colors.clay, fontWeight: "500" },

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

  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
    gap: 3,
  },

  navItem: {
    fontSize: 11,
    color: colors.charcoal,
  },

  navItemActive: {
    fontSize: 11,
    color: colors.clay,
    fontWeight: "600",
  },

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

  addText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 38,
  },

});
