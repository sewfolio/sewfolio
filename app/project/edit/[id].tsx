import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";
import { replaceProjectMaterials } from "../../../src/services/projectMaterials";
import { replaceProjectSteps } from "../../../src/services/projectSteps";
import { uploadImageToStorage } from "../../../src/services/imageUpload";
import { placeholderProject } from "../../../src/utils/placeholders";

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams();
  const { projects, workbooks, updateProject, deleteProject } = useSewfolio();

  const project = projects.find((item: any) => item.id === id) || projects[0];

  const [title, setTitle] = useState(project.title || "");
  const [sourceUrl, setSourceUrl] = useState(project.sourceUrl || "");
  const [description, setDescription] = useState(project.description || "");
  const [image, setImage] = useState(project.image || project.hero_image || "");
  const [difficulty, setDifficulty] = useState(project.difficulty || "");
  const [estimatedTime, setEstimatedTime] = useState(project.estimatedTime || "");
  const [notes, setNotes] = useState(project.notes || "");
  const [workbookId, setWorkbookId] = useState(project.workbookId || "");

  const [materialsText, setMaterialsText] = useState(
    (project.materials || [])
      .map((item: any) => `${item.name}${item.amount ? ` | ${item.amount}` : ""}${item.type ? ` | ${item.type}` : ""}`)
      .join("\n")
  );

  const [stepsText, setStepsText] = useState(
    (project.steps || [])
      .map((step: any) => (typeof step === "string" ? step : step.text))
      .join("\n")
  );

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function parseMaterials() {
    return materialsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, amount, type] = line.split("|").map((part) => part.trim());
        return {
          name,
          amount: amount || "",
          type: type || "material",
        };
      });
  }

  function parseSteps() {
    return stepsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, index) => ({
        order: index + 1,
        text,
      }));
  }

  async function removeProjectNow() {
    await deleteProject(project.id);
    router.replace("/(tabs)/explore");
  }

  async function saveProject() {
    const uploadedImage = image ? await uploadImageToStorage(image, "projects") : "";
    const materials = parseMaterials();
    const steps = parseSteps();

    updateProject(project.id, {
      title,
      workbookId,
      sourceUrl,
      image: uploadedImage,
      description,
      difficulty,
      estimatedTime,
      notes,
      materials,
      steps,
    });

    try {
      await replaceProjectMaterials(project.id, materials);
      await replaceProjectSteps(project.id, steps);
    } catch (error) {
      console.log("Failed to save materials or steps", error);
    }

    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.heading}>Edit Project</Text>

          <Pressable onPress={saveProject} style={styles.saveTop}>
            <Text style={styles.saveTopText}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Project cover image</Text>
          <Pressable onPress={pickImage} style={styles.imagePicker}>
            <Image source={image ? { uri: image } : placeholderProject} style={styles.previewImage} />
          </Pressable>

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={image}
            onChangeText={setImage}
            placeholder="Paste image URL or upload a photo"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Project title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Workbook</Text>
          <View style={styles.chipRow}>
            {workbooks.map((workbook: any) => (
              <Pressable
                key={workbook.id}
                onPress={() => setWorkbookId(workbook.id)}
                style={workbookId === workbook.id ? styles.chipActive : styles.chip}
              >
                <Text style={workbookId === workbook.id ? styles.chipTextActive : styles.chipText}>
                  {workbook.title || workbook.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Original source link</Text>
          <TextInput
            style={styles.input}
            value={sourceUrl}
            onChangeText={setSourceUrl}
            placeholder="https://..."
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Short project summary"
            placeholderTextColor={colors.mutedText}
          />

          <Text style={styles.label}>Difficulty</Text>
          <TextInput
            style={styles.input}
            value={difficulty}
            onChangeText={setDifficulty}
            placeholder="Beginner, intermediate, advanced..."
            placeholderTextColor={colors.mutedText}
          />

          <Text style={styles.label}>Estimated time</Text>
          <TextInput
            style={styles.input}
            value={estimatedTime}
            onChangeText={setEstimatedTime}
            placeholder="2 hours, weekend project..."
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Materials</Text>
          <Text style={styles.helpText}>One item per line. Use: name | amount | type</Text>

          <TextInput
            style={[styles.input, styles.largeTextArea]}
            value={materialsText}
            onChangeText={setMaterialsText}
            multiline
            placeholder={"Fabric | 1 yard | fabric\nZipper | 14 inch | notion\nThread | matching | notion"}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <Text style={styles.helpText}>One step per line.</Text>

          <TextInput
            style={[styles.input, styles.largeTextArea]}
            value={stepsText}
            onChangeText={setStepsText}
            multiline
            placeholder={"Cut fabric pieces\nSew exterior panels\nAttach zipper\nAdd lining\nTopstitch and finish"}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Fit notes, reminders, changes, ideas..."
            placeholderTextColor={colors.mutedText}
          />

          <Pressable onPress={saveProject} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Project</Text>
          </Pressable>

          <Pressable onPress={removeProjectNow} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Project</Text>
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
  heading: { fontSize: 28, color: colors.charcoal, fontWeight: "400" },
  saveTop: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage },
  saveTopText: { color: colors.white, fontSize: 13, fontWeight: "600" },

  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  helpText: { fontSize: 13, color: colors.mutedText, lineHeight: 19, marginBottom: spacing.md },

  imagePicker: {
    height: 210,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },

  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, color: colors.charcoal, fontSize: 15 },
  textArea: { height: 110, textAlignVertical: "top" },
  largeTextArea: { height: 190, textAlignVertical: "top" },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  chipActive: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.sage, borderWidth: 1, borderColor: colors.sage },
  chipText: { color: colors.charcoal, fontSize: 13 },
  chipTextActive: { color: colors.white, fontSize: 13, fontWeight: "600" },

  saveButton: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  deleteButton: { height: 54, borderRadius: radius.round, backgroundColor: "#F3DDD7", alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  deleteButtonText: { color: colors.clay, fontSize: 16, fontWeight: "600" },
});
