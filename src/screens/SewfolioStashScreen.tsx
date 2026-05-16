import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../theme";
import { useSewfolio } from "../store/sewfolioStore";
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
        <NavIcon type="projects" />
        <Text style={styles.navItem}>Projects</Text>
      </Pressable>

      <Pressable style={styles.addButton} onPress={() => router.push("/fabric/new")}>
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
  const { fabrics, stashCollections } = useSewfolio();
  const [selectedCollectionId, setSelectedCollectionId] = useState("all");
  const [query, setQuery] = useState("");

  const filteredFabrics = fabrics.filter((fabric: any) => {
    const matchesCollection =
      selectedCollectionId === "all" || fabric.collectionId === selectedCollectionId;

    const matchesSearch =
      fabric.name?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.type?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.color?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.brand?.toLowerCase().includes(query.toLowerCase());

    return matchesCollection && matchesSearch;
  });

  const activeCollection = stashCollections.find((item: any) => item.id === selectedCollectionId);

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
          placeholder="Search fabrics, brands, colors"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{fabrics.length}</Text>
            <Text style={styles.statLabel}>Fabrics</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stashCollections.length}</Text>
            <Text style={styles.statLabel}>Collections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredFabrics.length}</Text>
            <Text style={styles.statLabel}>Shown</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Collections</Text>
          <Pressable onPress={() => router.push("/stash/collections")}>
            <Text style={styles.seeAll}>Customize</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.collectionRow}>
            <Pressable
              onPress={() => setSelectedCollectionId("all")}
              style={[
                styles.collectionChip,
                selectedCollectionId === "all" && styles.collectionChipActive,
              ]}
            >
              <Text style={selectedCollectionId === "all" ? styles.collectionTextActive : styles.collectionText}>
                All
              </Text>
            </Pressable>

            {stashCollections.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedCollectionId(item.id)}
                style={[
                  styles.collectionChip,
                  selectedCollectionId === item.id && styles.collectionChipActive,
                ]}
              >
                <Text style={selectedCollectionId === item.id ? styles.collectionTextActive : styles.collectionText}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {selectedCollectionId === "all" && fabrics[0] && (
          <Pressable
            style={styles.featuredCard}
            onPress={() => router.push(`/fabric/${fabrics[0].id}`)}
          >
            <Text style={styles.featuredEyebrow}>Stash Snapshot</Text>
            <Text style={styles.featuredTitle}>{fabrics[0].name} is ready for your next project.</Text>
            <Text style={styles.featuredMeta}>{fabrics[0].yardage} available</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeaderLarge}>
          <Text style={styles.sectionTitle}>
            {selectedCollectionId === "all" ? "All Fabric" : activeCollection?.title}
          </Text>
          <Text style={styles.count}>{filteredFabrics.length} saved</Text>
        </View>

        <View style={styles.grid}>
          {filteredFabrics.map((item: any) => (
            <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/fabric/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.yardage}>{item.yardage}</Text>
                <Text style={styles.meta}>
                  {[item.color, item.type, item.brand].filter(Boolean).join(" · ") || "Uncategorized"}
                </Text>
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

  search: { height: 50, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, fontSize: 15, color: colors.charcoal, marginBottom: spacing.md },

  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, alignItems: "center" },
  statNumber: { fontSize: 21, color: colors.charcoal, fontWeight: "500" },
  statLabel: { fontSize: 11, color: colors.mutedText, marginTop: 3 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionHeaderLarge: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md, marginTop: spacing.xl },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  seeAll: { fontSize: 13, color: colors.olive },
  count: { fontSize: 13, color: colors.mutedText },

  collectionRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  collectionChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  collectionChipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  collectionText: { fontSize: 13, color: colors.charcoal },
  collectionTextActive: { fontSize: 13, color: colors.white, fontWeight: "600" },

  featuredCard: { backgroundColor: "#F3DDD7", borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.xl },
  featuredEyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 },
  featuredTitle: { fontSize: 21, color: colors.charcoal, fontWeight: "500", lineHeight: 27 },
  featuredMeta: { fontSize: 14, color: colors.mutedText, marginTop: spacing.sm },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card: { width: "47.8%", backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: "hidden", ...shadows.soft },
  image: { width: "100%", height: 130, backgroundColor: colors.oatmeal },
  cardBody: { padding: spacing.md },
  title: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  yardage: { fontSize: 13, color: colors.clay, marginTop: 3 },
  meta: { fontSize: 12, color: colors.mutedText, marginTop: 6 },

  bottomNav: { position: "absolute", bottom: 20, left: 16, right: 16, height: 82, borderRadius: 30, backgroundColor: "#FFFDF9", borderWidth: 1, borderColor: "#E8DDD3", flexDirection: "row", alignItems: "center", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  navButton: { alignItems: "center", justifyContent: "center", minWidth: 58, gap: 3 },
  navItem: { fontSize: 11, color: colors.charcoal },
  navItemActive: { fontSize: 11, color: colors.clay, fontWeight: "600" },
  addButton: { width: 62, height: 62, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: -32, borderWidth: 5, borderColor: "#FFFDF9" },
  addText: { color: colors.white, fontSize: 34, lineHeight: 38 },
});
