import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function AssignFabricToProjectScreen() {
  const { id } = useLocalSearchParams();
  const { projects, fabrics, stashCollections, toggleProjectFabric } = useSewfolio();

  const project = projects.find((item: any) => item.id === id) || projects[0];
  const selectedIds = project.fabricIds || (project.fabricId ? [project.fabricId] : []);

  const [query, setQuery] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("all");

  const filteredFabrics = fabrics.filter((fabric: any) => {
    const matchesSearch =
      fabric.name?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.color?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.type?.toLowerCase().includes(query.toLowerCase()) ||
      fabric.brand?.toLowerCase().includes(query.toLowerCase());

    const matchesCollection =
      selectedCollectionId === "all" || fabric.collectionId === selectedCollectionId;

    return matchesSearch && matchesCollection;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Assign Stash</Text>
          <Pressable onPress={() => router.back()} style={styles.doneButton}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.eyebrow}>For project</Text>
          <Text style={styles.projectName} numberOfLines={2}>{project.title}</Text>
          <Text style={styles.currentFabric}>
            {selectedIds.length} stash item{selectedIds.length === 1 ? "" : "s"} selected
          </Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search stash"
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setSelectedCollectionId("all")}
              style={selectedCollectionId === "all" ? styles.chipActive : styles.chip}
            >
              <Text style={selectedCollectionId === "all" ? styles.chipTextActive : styles.chipText}>
                All
              </Text>
            </Pressable>

            {stashCollections.map((collection: any) => (
              <Pressable
                key={collection.id}
                onPress={() => setSelectedCollectionId(collection.id)}
                style={selectedCollectionId === collection.id ? styles.chipActive : styles.chip}
              >
                <Text style={selectedCollectionId === collection.id ? styles.chipTextActive : styles.chipText}>
                  {collection.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filteredFabrics.map((fabric: any) => {
          const active = selectedIds.includes(fabric.id);

          return (
            <Pressable
              key={fabric.id}
              onPress={() => toggleProjectFabric(project.id, fabric.id)}
              style={active ? styles.fabricCardActive : styles.fabricCard}
            >
              <Image source={{ uri: fabric.image }} style={styles.fabricImage} />

              <View style={styles.fabricBody}>
                <Text style={active ? styles.fabricTitleActive : styles.fabricTitle} numberOfLines={2}>
                  {fabric.name}
                </Text>
                <Text style={active ? styles.fabricSubActive : styles.fabricSub}>
                  {[fabric.amount || fabric.yardage, fabric.color, fabric.brand].filter(Boolean).join(" · ") || "Fabric details"}
                </Text>
                <Text style={active ? styles.fabricSubActive : styles.fabricSub}>
                  {active ? "Selected · tap to remove" : "Tap to select"}
                </Text>
              </View>

              <View style={active ? styles.checkActive : styles.check}>
                <Text style={styles.checkText}>{active ? "✓" : ""}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  back: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },
  doneButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage },
  doneText: { color: colors.white, fontSize: 13, fontWeight: "600" },

  summaryCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: spacing.sm },
  projectName: { fontSize: 24, color: colors.charcoal, fontWeight: "500" },
  currentFabric: { color: colors.mutedText, fontSize: 13, marginTop: spacing.sm },

  search: { height: 52, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15, marginBottom: spacing.md },
  chipRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  chipActive: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1, borderColor: colors.sage, backgroundColor: colors.sage },
  chipText: { color: colors.charcoal, fontSize: 13 },
  chipTextActive: { color: colors.white, fontSize: 13, fontWeight: "600" },

  fabricCard: { flexDirection: "row", backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, alignItems: "center" },
  fabricCardActive: { flexDirection: "row", backgroundColor: colors.sage, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.sage, padding: spacing.md, marginBottom: spacing.md, alignItems: "center" },
  fabricImage: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  fabricBody: { flex: 1, marginLeft: spacing.md, justifyContent: "center" },
  fabricTitle: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  fabricTitleActive: { fontSize: 16, color: colors.white, fontWeight: "600" },
  fabricSub: { fontSize: 12, color: colors.mutedText, marginTop: 4 },
  fabricSubActive: { fontSize: 12, color: colors.white, marginTop: 4 },

  check: { width: 28, height: 28, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  checkActive: { width: 28, height: 28, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.sage, fontSize: 16, fontWeight: "700" },
});
