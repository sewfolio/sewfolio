import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { projects } from "../../src/data/mockData";

const progressStages = [
  { label: "Idea", value: 5 },
  { label: "Planned", value: 20 },
  { label: "Cutting", value: 40 },
  { label: "Sewing", value: 60 },
  { label: "Finishing", value: 85 },
  { label: "Done", value: 100 },
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress}%` }]} />
    </View>
  );
}

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const project = projects.find((item) => item.id === id) || projects[0];
  const [showProgressPicker, setShowProgressPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");
  const [progress, setProgress] = useState(progress);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Project Details</Text>
          <Pressable style={styles.more}>
            <Text style={styles.moreText}>⋯</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image source={{ uri: project.image }} style={styles.heroImage} />

          <View style={styles.heroBody}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>{project.status}</Text>
                <Text style={styles.title}>{project.title}</Text>
              </View>
              <Text style={styles.percent}>{progress}%</Text>
            </View>

            <ProgressBar progress={progress} />

            <View style={styles.progressSummary}>
              <View>
                <Text style={styles.progressLabel}>Current stage</Text>
                <Text style={styles.progressValue}>
                  {progressStages.find((stage) => stage.value === progress)?.label || "Custom"} · {progress}%
                </Text>
              </View>

              <Pressable
                style={styles.updateButton}
                onPress={() => setShowProgressPicker((current) => !current)}
              >
                <Text style={styles.updateButtonText}>
                  {showProgressPicker ? "Close" : "Update"}
                </Text>
              </Pressable>
            </View>

            {showProgressPicker && (
              <View style={styles.progressChoices}>
                {progressStages.map((stage) => (
                  <Pressable
                    key={stage.label}
                    onPress={() => {
                      setProgress(stage.value);
                      setShowProgressPicker(false);
                    }}
                    style={progress === stage.value ? styles.stageActive : styles.stage}
                  >
                    <Text style={progress === stage.value ? styles.stageTextActive : styles.stageText}>
                      {stage.label}
                    </Text>
                    <Text style={progress === stage.value ? styles.stagePercentActive : styles.stagePercent}>
                      {stage.value}%
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.tabs}>
          {["Details", "Materials", "Notes", "Photos"].map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <Text style={activeTab === tab ? styles.tabActive : styles.tab}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "Details" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Project Info</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Pattern</Text>
              <Text style={styles.rowValue}>{project.pattern}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Fabric</Text>
              <Text style={styles.rowValue}>{project.fabric}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Status</Text>
              <Text style={styles.rowValue}>{project.status}</Text>
            </View>

            <View style={styles.rowLast}>
              <Text style={styles.rowLabel}>Due date</Text>
              <Text style={styles.rowValue}>{project.dueDate}</Text>
            </View>
          </View>
        )}

        {activeTab === "Materials" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Materials</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Main fabric</Text>
              <Text style={styles.rowValue}>{project.fabric}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Thread</Text>
              <Text style={styles.rowValue}>Matching thread</Text>
            </View>
            <View style={styles.rowLast}>
              <Text style={styles.rowLabel}>Notions</Text>
              <Text style={styles.rowValue}>Invisible zipper, interfacing</Text>
            </View>
          </View>
        )}

        {activeTab === "Notes" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{project.notes}</Text>
          </View>
        )}

        {activeTab === "Photos" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.notes}>Project photo gallery placeholder.</Text>
          </View>
        )}

        <View style={styles.cardBlush}>
          <Text style={styles.sectionTitle}>Next best step</Text>
          <Text style={styles.notes}>
            Review materials and update your shopping list before your next sewing session.
          </Text>
        </View>
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
  more: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  moreText: { fontSize: 26, color: colors.charcoal, marginTop: -8 },
  heading: { fontSize: 26, color: colors.charcoal, fontWeight: "400" },

  heroCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg, ...shadows.soft },
  heroImage: { width: "100%", height: 230, backgroundColor: colors.oatmeal },
  heroBody: { padding: spacing.lg },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.md },
  eyebrow: { color: colors.clay, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 },
  title: { fontSize: 28, color: colors.charcoal, fontWeight: "500" },
  percent: { fontSize: 18, color: colors.sage, fontWeight: "600" },

  track: { height: 6, backgroundColor: colors.oatmeal, borderRadius: radius.round, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.sage },

  progressSummary: {
    marginTop: spacing.lg,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 3,
  },
  progressValue: {
    fontSize: 16,
    color: colors.charcoal,
    fontWeight: "500",
  },
  updateButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  progressChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  stage: {
    width: "31.5%",
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  stageActive: {
    width: "31.5%",
    borderRadius: radius.lg,
    backgroundColor: colors.sage,
    borderWidth: 1,
    borderColor: colors.sage,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  stageText: {
    fontSize: 13,
    color: colors.charcoal,
    fontWeight: "500",
  },
  stageTextActive: {
    fontSize: 13,
    color: colors.white,
    fontWeight: "600",
  },
  stagePercent: {
    fontSize: 11,
    color: colors.mutedText,
    marginTop: 3,
  },
  stagePercentActive: {
    fontSize: 11,
    color: colors.white,
    marginTop: 3,
  },

  tabs: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  tab: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, color: colors.charcoal, fontSize: 13 },
  tabActive: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage, color: colors.white, fontSize: 13 },

  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  cardBlush: { backgroundColor: "#F3DDD7", borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.lg },
  rowLast: { flexDirection: "row", justifyContent: "space-between", paddingTop: spacing.md, gap: spacing.lg },
  rowLabel: { fontSize: 14, color: colors.mutedText },
  rowValue: { fontSize: 14, color: colors.charcoal, fontWeight: "500", flex: 1, textAlign: "right" },
  notes: { fontSize: 15, color: colors.mutedText, lineHeight: 23 },
});
