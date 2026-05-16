import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function AssignFabricScreen() {
  const { id } = useLocalSearchParams();
  const { fabrics, projects, workbooks, updateProject } = useSewfolio();

  const fabric = fabrics.find((item: any) => item.id === id) || fabrics[0];
  const [query, setQuery] = useState("");
  const [selectedWorkbookId, setSelectedWorkbookId] = useState("all");

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.title?.toLowerCase().includes(query.toLowerCase());
    const matchesWorkbook = selectedWorkbookId === "all" || project.workbookId === selectedWorkbookId;
    return matchesSearch && matchesWorkbook;
  });

  function assign(project: any) {
    updateProject(project.id, { fabricId: fabric.id, fabric: fabric.name });
    router.back();
  }

  function unassign(project: any) {
    updateProject(project.id, { fabricId: "", fabric: "Not selected" });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Assign Fabric</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.eyebrow}>Assigning</Text>
          <Text style={styles.fabricName}>{fabric.name}</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search projects"
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setSelectedWorkbookId("all")}
              style={selectedWorkbookId === "all" ? styles.chipActive : styles.chip}
            >
              <Text style={selectedWorkbookId === "all" ? styles.chipTextActive : styles.chipText}>All</Text>
            </Pressable>

            {workbooks.map((workbook: any) => (
              <Pressable
                key={workbook.id}
                onPress={() => setSelectedWorkbookId(workbook.id)}
                style={selectedWorkbookId === workbook.id ? styles.chipActive : styles.chip}
              >
                <Text style={selectedWorkbookId === workbook.id ? styles.chipTextActive : styles.chipText}>
                  {workbook.title || workbook.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filteredProjects.map((project: any) => {
          const workbook = workbooks.find((w: any) => w.id === project.workbookId);
          const active = project.fabricId === fabric.id;

          return (
            <Pressable
              key={project.id}
              onPress={() => active ? unassign(project) : assign(project)}
              style={active ? styles.projectCardActive : styles.projectCard}
            >
              <Text style={active ? styles.projectTitleActive : styles.projectTitle} numberOfLines={2}>
                {project.title}
              </Text>
              <Text style={active ? styles.projectSubActive : styles.projectSub}>
                {workbook ? `Workbook: ${workbook.title || workbook.name}` : "Uncategorized"}
              </Text>
              <Text style={active ? styles.projectSubActive : styles.projectSub}>
                {active ? "Tap to remove assignment" : "Tap to assign"}
              </Text>
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
  spacer: { width: 44 },
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },
  summaryCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: spacing.sm },
  fabricName: { fontSize: 26, color: colors.charcoal, fontWeight: "500" },
  search: { height: 52, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15, marginBottom: spacing.md },
  chipRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  chipActive: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1, borderColor: colors.sage, backgroundColor: colors.sage },
  chipText: { color: colors.charcoal, fontSize: 13 },
  chipTextActive: { color: colors.white, fontSize: 13, fontWeight: "600" },
  projectCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  projectCardActive: { backgroundColor: colors.sage, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.sage, padding: spacing.lg, marginBottom: spacing.md },
  projectTitle: { fontSize: 17, color: colors.charcoal, fontWeight: "500" },
  projectTitleActive: { fontSize: 17, color: colors.white, fontWeight: "600" },
  projectSub: { fontSize: 13, color: colors.mutedText, marginTop: 5 },
  projectSubActive: { fontSize: 13, color: colors.white, marginTop: 5 },
});
