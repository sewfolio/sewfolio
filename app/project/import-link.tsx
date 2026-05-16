import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";
import { importProjectFromUrl } from "../../src/services/importProject";
import { placeholderProject } from "../../src/utils/placeholders";

const tints = ["#F3DDD7", "#EFECE2", "#F5EFE9", "#E9E5D9"];

export default function ImportProjectLinkScreen() {
  const { addProject, workbooks, addWorkbook } = useSewfolio();

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [materials, setMaterials] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [selectedWorkbookId, setSelectedWorkbookId] = useState(workbooks[0]?.id || "");
  const [newWorkbookName, setNewWorkbookName] = useState("");
  const [loading, setLoading] = useState(false);

  function cleanText(value: string) {
    return value
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  async function importDetails() {
    if (!url.trim()) return;

    try {
      setLoading(true);
      const imported = await importProjectFromUrl(url.trim());

      setTitle(cleanText(imported.title || ""));
      setImage(imported.image || "");
      setDescription(cleanText(imported.description || ""));
      setSourceName(imported.sourceName || "");
      setMaterials(imported.materials || []);
      setSteps(imported.steps || []);
    } catch (error) {
      console.log("Import failed", error);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkbook() {
    if (!newWorkbookName.trim()) return;

    const workbookTitle = newWorkbookName.trim();
    const id = workbookTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `workbook-${Date.now()}`;

    await addWorkbook({
      id,
      title: workbookTitle,
      tint: tints[Math.floor(Math.random() * tints.length)],
    });

    setSelectedWorkbookId(id);
    setNewWorkbookName("");
  }

  async function saveProject() {
    const cleanTitle = title || "Saved Online Project";
    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `project-${Date.now()}`;

    await addProject({
      id,
      title: cleanTitle,
      workbookId: selectedWorkbookId,
      sourceUrl: url,
      sourceName,
      image,
      description,
      difficulty: "",
      estimatedTime: "",
      notes: url ? `Saved from: ${url}` : "",
      materials,
      steps,
    });

    router.replace("/(tabs)/explore");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            placeholder="Paste project, blog, tutorial, or pattern link"
            placeholderTextColor={colors.mutedText}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
          />

          <Pressable onPress={importDetails} style={styles.importButton}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.importButtonText}>Import Details from Link</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Review Project</Text>

          <Image
            source={image ? { uri: image } : placeholderProject}
            style={styles.previewImage}
          />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste image URL or leave blank for placeholder"
            placeholderTextColor={colors.mutedText}
            value={image}
            onChangeText={setImage}
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

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Short project summary"
            placeholderTextColor={colors.mutedText}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Materials</Text>

          {materials.length === 0 ? (
            <Text style={styles.emptyText}>No materials imported yet.</Text>
          ) : (
            materials.map((item: any, index: number) => (
              <View key={`${item.name}-${index}`} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.name}</Text>
                  <Text style={styles.rowSub}>{item.type || "material"}</Text>
                </View>
                <Text style={styles.rowAmount}>{item.amount || "Not specified"}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Steps</Text>

          {steps.length === 0 ? (
            <Text style={styles.emptyText}>No steps imported yet.</Text>
          ) : (
            steps.map((step: any, index: number) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{typeof step === "string" ? step : step.text}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add to Workbook</Text>

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
            <Text style={styles.buttonText}>Save Project</Text>
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

  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  labelSmall: { fontSize: 13, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.md },

  input: { minHeight: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, color: colors.charcoal, fontSize: 15 },
  textArea: { height: 110, textAlignVertical: "top" },
  previewImage: { width: "100%", height: 210, borderRadius: radius.lg, backgroundColor: colors.oatmeal, marginBottom: spacing.md },

  importButton: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  importButtonText: { color: colors.white, fontSize: 16, fontWeight: "600" },

  emptyText: { color: colors.mutedText, fontSize: 14, lineHeight: 22 },
  row: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowTitle: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  rowSub: { fontSize: 12, color: colors.mutedText, marginTop: 3, textTransform: "capitalize" },
  rowAmount: { fontSize: 14, color: colors.clay, fontWeight: "500", maxWidth: 120, textAlign: "right" },

  stepRow: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  stepNumber: { width: 28, height: 28, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  stepNumberText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  stepText: { flex: 1, color: colors.charcoal, fontSize: 15, lineHeight: 23 },

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
