import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import HomeIcon from "../../assets/icons/home.svg";
import ProjectsIcon from "../../assets/icons/projects.svg";
import StashIcon from "../../assets/icons/stash.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import { colors, radius, shadows, spacing } from "../theme";
import { useSewfolio } from "../store/sewfolioStore";
import { placeholderProject } from "../utils/placeholders";

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );
}


function NavIcon({ type, active = false }: { type: string; active?: boolean }) {
  const color = active ? colors.clay : colors.sage;
  const size = 34;

  if (type === "home") return <HomeIcon width={size} height={size} color={color} />;
  if (type === "projects") return <ProjectsIcon width={size} height={size} color={color} />;
  if (type === "stash") return <StashIcon width={size} height={size} color={color} />;
  if (type === "profile") return <ProfileIcon width={size} height={size} color={color} />;

  return null;
}

function StatCard({ number, label, icon, tint }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: tint }]}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MiniProjectCard({ item }: any) {
  return (
    <Pressable style={styles.miniProjectCard} onPress={() => router.push(`/project/${item.id}`)}>
      <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.miniImage} />
      <View style={styles.miniContent}>
        <Text style={styles.miniTitle}>{item.title}</Text>
        <Text style={styles.miniMeta}>{item.status} · Last edited today</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{item.category || "Saved"}</Text>
          {item.sourceUrl ? <Text style={styles.tag}>Online</Text> : <Text style={styles.tag}>Manual</Text>}
        </View>
      </View>
    </Pressable>
  );
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

export default function SewfolioHomeScreen() {
  const { projects, fabrics } = useSewfolio();
  const featured = projects[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, sewist ✨</Text>
            <Text style={styles.heading}>My Dashboard</Text>
          </View>

          <Pressable onPress={() => router.push("/(tabs)/profile")} style={styles.avatarButton}>
            <Text style={styles.avatarText}>M</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard number="12" label="Projects" tint="#F3DDD7" />
          <StatCard number="5" label="WIPs" tint="#EFECE2" />
          <StatCard number="8" label="Finished" tint="#F5EFE9" />
          <StatCard number="23" label="Ideas" tint="#E9E5D9" />
        </View>

        <Pressable style={styles.heroCard} onPress={() => router.push(`/project/${featured.id}`)}>
          <Image source={{ uri: featured.image }} style={styles.heroImage} />
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <Text style={styles.eyebrow}>Continue Working</Text>
              
            </View>

            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroMeta}>Pattern: Estuary Dress · Fabric: Washed linen</Text>

            <Pressable onPress={() => router.push(`/project/${featured.id}`)} style={styles.resumeButton}>
              <Text style={styles.resumeText}>Resume Project</Text>
            </Pressable>
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}><Pressable onPress={() => router.push("/(tabs)/explore")}><Pressable onPress={() => router.push("/(tabs)/explore")}><Text style={styles.seeAll}>See all</Text></Pressable></Pressable></Pressable>
        </View>

        {projects.slice(1).map((item) => (
          <MiniProjectCard key={item.id} item={item} />
        ))}

        <View style={styles.sectionHeaderLarge}>
          <Text style={styles.sectionTitle}>Recently Saved</Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}><Text style={styles.seeAll}>See all</Text></Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.savedRow}>
            {projects.length === 0 ? (
              <Pressable style={styles.emptyCard} onPress={() => router.push("/project/import-link")}>
                <Text style={styles.emptyTitle}>No saved projects yet</Text>
                <Text style={styles.emptyText}>Import a sewing tutorial or save your first project.</Text>
              </Pressable>
            ) : (
              projects.map((item) => (
                <Pressable key={item.id} style={styles.savedCard} onPress={() => router.push(`/project/${item.id}`)}>
                  <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.savedImage} />
                  <Text style={styles.savedLabel} numberOfLines={1}>{item.title}</Text>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.sectionHeaderLarge}>
          <Text style={styles.sectionTitle}>Stash Snapshot</Text>
          <Pressable onPress={() => router.push("/stash")}><Pressable onPress={() => router.push("/stash")}><Text style={styles.seeAll}>View stash</Text></Pressable></Pressable>
        </View>

        <View style={styles.stashRow}>
          {fabrics.slice(0, 2).map((item) => (
            <Pressable key={item.name} style={styles.fabricCard} onPress={() => router.push(`/fabric/${item.id}`)}>
              <Image source={item.image ? { uri: item.image } : placeholderProject} style={styles.fabricImage} />
              <Text style={styles.fabricTitle}>{item.name}</Text>
              <Text style={styles.fabricMeta}>{item.yardage}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Next best step</Text>
          <Text style={styles.insightText}>
            Add materials to your Linen Midi Dress so your shopping list stays current.
          </Text>
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { flex: 1 },
  content: {
    paddingTop: 70,
    paddingHorizontal: spacing.lg,
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 14,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 28,
    lineHeight: 35,
    color: colors.charcoal,
    fontWeight: "400",
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    color: colors.sage,
    fontSize: 19,
    fontWeight: "500",
  },

  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: "#E8DDD3",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
    marginBottom: 3,
  },
  iconCircleActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  iconText: {
    fontSize: 11,
    color: colors.sage,
    fontWeight: "500",
  },
  iconTextActive: {
    color: colors.white,
  },
  statNumber: {
    fontSize: 21,
    color: colors.charcoal,
    fontWeight: "500",
  },
  statLabel: {
    fontSize: 11,
    color: colors.charcoal,
    marginTop: 3,
  },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  heroImage: {
    width: "100%",
    height: 145,
    backgroundColor: colors.oatmeal,
  },
  heroContent: {
    padding: spacing.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  eyebrow: {
    fontSize: 12,
    color: colors.clay,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  heroPercent: {
    fontSize: 13,
    color: colors.sage,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 22,
    color: colors.charcoal,
    fontWeight: "500",
    marginBottom: 4,
  },
  heroMeta: {
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: spacing.md,
  },
  resumeButton: {
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  resumeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionHeaderLarge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 19,
    color: colors.charcoal,
    fontWeight: "500",
  },
  seeAll: {
    color: colors.olive,
    fontSize: 13,
  },

  miniProjectCard: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  miniImage: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.oatmeal,
  },
  miniContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  miniTitle: {
    fontSize: 16,
    color: colors.charcoal,
    fontWeight: "500",
  },
  miniMeta: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
  },
  miniProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  tagRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    color: colors.charcoal,
    fontSize: 11,
    overflow: "hidden",
  },

  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: radius.round,
    backgroundColor: colors.oatmeal,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.round,
    backgroundColor: colors.sage,
  },
  percent: {
    fontSize: 12,
    color: colors.charcoal,
  },

  savedRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  savedCard: {
    width: 96,
  },
  savedImage: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.oatmeal,
    marginBottom: spacing.sm,
  },
  emptyCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.charcoal,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  savedLabel: {
    fontSize: 12,
    color: colors.mutedText,
  },

  stashRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  fabricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  fabricImage: {
    width: "100%",
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.oatmeal,
    marginBottom: spacing.sm,
  },
  fabricTitle: {
    fontSize: 15,
    color: colors.charcoal,
    fontWeight: "500",
  },
  fabricMeta: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 2,
  },

  insightCard: {
    backgroundColor: "#F3DDD7",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  insightTitle: {
    fontSize: 17,
    color: colors.charcoal,
    fontWeight: "500",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: colors.mutedText,
    lineHeight: 21,
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
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
    gap: 3,
  },
  navItem: {
    fontSize: 11,
    color: colors.charcoal,
    marginTop: 3,
  },
  navItemActive: {
    fontSize: 11,
    color: colors.clay,
    fontWeight: "600",
    marginTop: 3,
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  addText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 38,
  },
});
