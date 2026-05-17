import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";

import HomeIcon from "../../assets/icons/home.svg";
import ProjectsIcon from "../../assets/icons/projects.svg";
import StashIcon from "../../assets/icons/stash.svg";
import ProfileIcon from "../../assets/icons/profile.svg";

type TabName = "home" | "projects" | "stash" | "profile";

function NavIcon({ type, active = false }: { type: TabName; active?: boolean }) {
  const color = active ? colors.clay : colors.sage;
  const size = 34;

  if (type === "home") return <HomeIcon width={size} height={size} color={color} />;
  if (type === "projects") return <ProjectsIcon width={size} height={size} color={color} />;
  if (type === "stash") return <StashIcon width={size} height={size} color={color} />;
  if (type === "profile") return <ProfileIcon width={size} height={size} color={color} />;

  return null;
}

export default function BottomNav({ active }: { active: TabName }) {
  return (
    <View style={styles.bottomNav}>
      <Pressable onPress={() => router.push("/(tabs)")} style={styles.navButton}>
        <NavIcon type="home" active={active === "home"} />
        <Text style={active === "home" ? styles.navItemActive : styles.navItem}>Home</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/explore")} style={styles.navButton}>
        <NavIcon type="projects" active={active === "projects"} />
        <Text style={active === "projects" ? styles.navItemActive : styles.navItem}>Projects</Text>
      </Pressable>

      <Pressable style={styles.addButton} onPress={() => router.push("/project/import-link")}>
        <Text style={styles.addText}>+</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/stash")} style={styles.navButton}>
        <NavIcon type="stash" active={active === "stash"} />
        <Text style={active === "stash" ? styles.navItemActive : styles.navItem}>Stash</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.navButton}>
        <NavIcon type="profile" active={active === "profile"} />
        <Text style={active === "profile" ? styles.navItemActive : styles.navItem}>Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  addText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 38,
  },
});
