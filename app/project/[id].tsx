import React, { useState } from "react";
import { Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";
import { placeholderProject } from "../../src/utils/placeholders";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { projects, fabrics, workbooks, updateProjectStatus } = useSewfolio();

  const project = projects.find((item: any) => item.id === id) || projects[0];
  const workbook = workbooks.find((item: any) => item.id === project?.workbookId);

  const assignedFabricIds = project.fabricIds || (project.fabricId ? [project.fabricId] : []);
  const assignedFabrics = fabrics.filter((fabric: any) => assignedFabricIds.includes(fabric.id));

  const [activeTab, setActiveTab] = useState("Overview");

  const materials = project.materials || [
    { name: project.fabric || "Fabric", amount: "Not specified", type: "fabric" },
    { name: "Thread", amount: "As needed", type: "notion" },
  ];

  const steps = project.steps || [
    "Review the original source post.",
    "Gather fabric, notions, and tools.",
    "Read through instructions before cutting.",
  ];

  async function openSource() {
    const url = project.sourceUrl || "";

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log("Unable to open source URL", error);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.heading}>Project</Text>

          <Pressable onPress={() => router.push(`/project/edit/${project.id}`)} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image source={project.image ? { uri: project.image } : placeholderProject} style={styles.heroImage} />

          <View style={styles.heroBody}>
            <Text style={styles.eyebrow}>{workbook?.title || "Saved Project"}</Text>
            <Text style={styles.title}>{project.title}</Text>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => updateProjectStatus(project.id, project.status === "finished" ? "in_progress" : "finished")}
                style={project.status === "finished" ? styles.finishedButton : styles.statusButton}
              >
                <Text style={styles.statusButtonText}>
                  {project.status === "finished" ? "Marked Finished" : "Mark Finished"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push({
  pathname: "/project/shopping/[id]",
  params: { id: project.id }
})}
                style={styles.shoppingButton}
              >
                <Text style={styles.shoppingButtonText}>Shopping List</Text>
              </Pressable>
            </View>

            <View style={styles.sourceMetaRow}>
              <Text style={project.sourceUrl ? styles.importedBadge : styles.manualBadge}>
                {project.sourceUrl ? "Imported" : "Manual"}
              </Text>

              <Text style={styles.sourceMetaText}>
                {project.sourceName || project.source_name || "Sewfolio"}
              </Text>
            </View>

            {project.sourceUrl?.startsWith("http") ? (
              <Pressable onPress={openSource} style={styles.sourceButton}>
                <Text style={styles.sourceButtonText}>Open Original Post</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabs}>
            {["Overview", "Materials", "Steps", "Stash", "Notes"].map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                <Text style={activeTab === tab ? styles.tabActive : styles.tab}>{tab}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {activeTab === "Overview" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Overview</Text>

            <InfoRow label="Workbook" value={workbook?.title || "Uncategorized"} />
            <InfoRow label="Source" value={project.sourceUrl ? "Original post saved" : "Manual project"} />
            <InfoRow label="Difficulty" value={project.difficulty || "Not set"} />
            <InfoRow label="Estimated time" value={project.estimatedTime || "Not set"} last />

            <Text style={styles.bodyText}>
              {project.description || "Project details will appear here after importing from a link or adding notes manually."}
            </Text>
          </View>
        )}

        {activeTab === "Materials" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Materials Needed</Text>

            {materials.map((item: any, index: number) => (
              <View key={`${item.name}-${index}`} style={styles.materialRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.materialName}>{item.name}</Text>
                  <Text style={styles.materialType}>{item.type || "material"}</Text>
                </View>
                <Text style={styles.materialAmount}>{item.amount || "Not specified"}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Steps" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Steps</Text>

            {steps.map((step: any, index: number) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{typeof step === "string" ? step : step.text}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "Stash" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Assigned Stash</Text>

            {assignedFabrics.length === 0 ? (
              <Text style={styles.bodyText}>No stash items assigned yet.</Text>
            ) : (
              assignedFabrics.map((fabric: any) => (
                <Pressable key={fabric.id} style={styles.fabricRow} onPress={() => router.push(`/fabric/${fabric.id}`)}>
                  <Image source={{ uri: fabric.image }} style={styles.fabricImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fabricName}>{fabric.name}</Text>
                    <Text style={styles.fabricMeta}>
                      {[fabric.amount || fabric.yardage, fabric.color, fabric.brand].filter(Boolean).join(" · ") || "Fabric details"}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}

            <Pressable onPress={() => router.push(`/project/assign-fabric/${project.id}`)} style={styles.assignButton}>
              <Text style={styles.assignButtonText}>
                {assignedFabrics.length ? "Manage Stash Items" : "Assign From Stash"}
              </Text>
            </Pressable>
          </View>
        )}

        {activeTab === "Notes" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.bodyText}>{project.notes || "No notes yet."}</Text>

            {project.sourceUrl ? (
              <View style={styles.sourceBox}>
                <Text style={styles.sourceLabel}>Original Source</Text>
                <Text style={styles.sourceUrl}>{project.sourceUrl}</Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={last ? styles.infoRowLast : styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 50 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  back: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  heading: { fontSize: 28, color: colors.charcoal, fontWeight: "400" },
  editButton: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  editText: { color: colors.charcoal, fontSize: 13, fontWeight: "500" },

  heroCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg, ...shadows.soft },
  heroImage: { width: "100%", height: 230, backgroundColor: colors.oatmeal },
  heroBody: { padding: spacing.lg },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 },
  title: { fontSize: 30, color: colors.charcoal, fontWeight: "500", lineHeight: 36 },
  meta: { fontSize: 14, color: colors.mutedText, marginTop: spacing.sm },
  sourceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  importedBadge: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  manualBadge: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    color: colors.charcoal,
    fontSize: 12,
    fontWeight: "600",
  },
  sourceMetaText: {
    color: colors.mutedText,
    fontSize: 13,
  },

  sourceButton: { height: 48, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  sourceButtonText: { color: colors.white, fontSize: 15, fontWeight: "600" },

  tabs: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  tab: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, color: colors.charcoal, fontSize: 13 },
  tabActive: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage, color: colors.white, fontSize: 13 },

  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.md },
  bodyText: { fontSize: 15, color: colors.mutedText, lineHeight: 23 },

  infoRow: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoRowLast: { paddingTop: spacing.md, paddingBottom: spacing.md },
  infoLabel: { fontSize: 13, color: colors.mutedText, marginBottom: 4 },
  infoValue: { fontSize: 16, color: colors.charcoal },

  materialRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  materialName: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  materialType: { fontSize: 12, color: colors.mutedText, marginTop: 3, textTransform: "capitalize" },
  materialAmount: { fontSize: 14, color: colors.clay, fontWeight: "500", textAlign: "right", maxWidth: 120 },

  stepRow: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  stepNumber: { width: 28, height: 28, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  stepNumberText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  stepText: { flex: 1, color: colors.charcoal, fontSize: 15, lineHeight: 23 },

  fabricRow: { flexDirection: "row", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  fabricImage: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  fabricName: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  fabricMeta: { fontSize: 12, color: colors.mutedText, marginTop: 4, lineHeight: 18 },

  assignButton: { height: 52, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  assignButtonText: { color: colors.white, fontSize: 15, fontWeight: "600" },

  sourceBox: { backgroundColor: colors.cream, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginTop: spacing.lg },
  sourceLabel: { fontSize: 12, color: colors.clay, textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 },
  sourceUrl: { fontSize: 13, color: colors.mutedText, lineHeight: 19 },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  shoppingButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  shoppingButtonText: {
    color: colors.charcoal,
    fontSize: 14,
    fontWeight: "700",
  },

  statusButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.sage,
    borderRadius: radius.round,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: spacing.md,
  },
  finishedButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.clay,
    borderRadius: radius.round,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: spacing.md,
  },
  statusButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
