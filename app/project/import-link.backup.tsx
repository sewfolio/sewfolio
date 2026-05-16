import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";

const tints = ["#F3DDD7", "#EFECE2", "#F5EFE9", "#E9E5D9"];

export default function ImportProjectLinkScreen() {
  const { addProject, workbooks, addWorkbook } = useSewfolio();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [selectedWorkbookId, setSelectedWorkbookId] = useState(workbooks[0]?.id || "");
  const [newWorkbookName, setNewWorkbookName] = useState("");

  function createWorkbook() {
    if (!newWorkbookName.trim()) return;

    const title = newWorkbookName.trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `workbook-${Date.now()}`;

    addWorkbook({
      id,
      title,
      tint: tints[Math.floor(Math.random() * tints.length)],
    });

    setSelectedWorkbookId(id);
    setNewWorkbookName("");
  }

  async function fetchPreview(link: string) {
    setUrl(link);

    if (!link.startsWith("http")) return;
  }

  function saveProject() {
    const cleanTitle = title || "Saved Online Project";
    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `project-${Date.now()}`;

    addProject({
      id,
      title: cleanTitle,
      status: "Saved",
      category: "Saved",
      workbookId: selectedWorkbookId,
      pattern: "Online inspiration",
      fabric: "Not selected",
      dueDate: "Not set",
      notes: url ? `Saved from: ${url}` : "Saved from online.",
      sourceUrl: url,
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
      sourceName,
    });

    router.replace("/(tabs)/explore");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Save Project</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Project link</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste project, pattern, blog, or Pinterest link"
            placeholderTextColor={colors.mutedText}
            value={url}
            onChangeText={fetchPreview}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Project name</Text>
          <TextInput
            style={styles.input}
            placeholder="Linen dress, quilted tote, etc."
            placeholderTextColor={colors.mutedText}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.sectionTitle}>Add to workbook</Text>

          <View style={styles.workbookGrid}>
            {workbooks.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedWorkbookId(item.id)}
                style={[
                  styles.workbookChip,
                  selectedWorkbookId === item.id && styles.workbookChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.workbookChipText,
                    selectedWorkbookId === item.id && styles.workbookChipTextActive,
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.newWorkbookBox}>
            <Text style={styles.labelSmall}>Create new workbook</Text>
            <TextInput
              style={styles.input}
              placeholder="Weekend makes, kids clothes, gifts..."
              placeholderTextColor={colors.mutedText}
              value={newWorkbookName}
              onChangeText={setNewWorkbookName}
            />
            <Pressable onPress={createWorkbook} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Create Workbook</Text>
            </Pressable>
          </View>

          <Pressable onPress={saveProject} style={styles.button}>
            <Text style={styles.buttonText}>Save to Projects</Text>
          </Pressable>
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
  spacer: { width: 44 },
  heading: { fontSize: 28, color: colors.charcoal, fontWeight: "400" },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  labelSmall: { fontSize: 13, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  input: { height: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  sectionTitle: { fontSize: 18, color: colors.charcoal, fontWeight: "500", marginTop: spacing.xl, marginBottom: spacing.md },
  workbookGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  workbookChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  workbookChipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  workbookChipText: { fontSize: 13, color: colors.charcoal },
  workbookChipTextActive: { color: colors.white, fontWeight: "600" },
  newWorkbookBox: { backgroundColor: colors.cream, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginTop: spacing.lg },
  secondaryButton: { height: 46, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  secondaryText: { color: colors.charcoal, fontSize: 14, fontWeight: "600" },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
