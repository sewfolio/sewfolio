import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing, shadows } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";
import { uploadImageToStorage } from "../../../src/services/imageUpload";

export default function EnrichProjectScreen() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);
  const { projects, updateProject } = useSewfolio();
  const project = projects.find((item: any) => item.id === projectId);

  const [notes, setNotes] = useState(project?.notes || "");
  const [materialsText, setMaterialsText] = useState(
    (project?.materials || []).map((item: any) => item.name || item).join("\n")
  );
  const [stepsText, setStepsText] = useState((project?.steps || []).join("\n"));
  const [image, setImage] = useState(project?.image || "");
  const [saving, setSaving] = useState(false);

  if (!project) return null;

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function save() {
    setSaving(true);

    const finalImage = image?.startsWith("file:")
      ? await uploadImageToStorage(image, "projects")
      : image;

    updateProject(project.id, {
      notes,
      image: finalImage,
      materials: materialsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((name) => ({ name, amount: "", type: "Supply" })),
      steps: stepsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });

    setSaving(false);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>ENRICH PROJECT</Text>
        <Text style={styles.heading}>{project.title}</Text>
        <Text style={styles.subhead}>Add the details TikTok, Instagram, or short videos leave out.</Text>

        <Pressable onPress={pickImage} style={styles.imageCard}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
          <Text style={styles.imageText}>{image ? "Change image" : "Add screenshot or project image"}</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.label}>Supplies</Text>
          <TextInput
            style={styles.textArea}
            value={materialsText}
            onChangeText={setMaterialsText}
            placeholder="One supply per line"
            placeholderTextColor={colors.mutedText}
            multiline
          />

          <Text style={styles.label}>Steps</Text>
          <TextInput
            style={styles.textArea}
            value={stepsText}
            onChangeText={setStepsText}
            placeholder="One step per line"
            placeholderTextColor={colors.mutedText}
            multiline
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Measurements, creator tips, fabric ideas, reminders..."
            placeholderTextColor={colors.mutedText}
            multiline
          />

          <Pressable onPress={save} style={styles.saveButton}>
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save Details"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 90 },
  back: { width: 52, height: 52, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
  backText: { fontSize: 38, color: colors.charcoal, marginTop: -4 },
  eyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2.4, fontWeight: "700", marginBottom: 8 },
  heading: { color: colors.charcoal, fontSize: 36, lineHeight: 42, fontWeight: "400" },
  subhead: { color: colors.mutedText, fontSize: 16, lineHeight: 23, marginTop: spacing.sm, marginBottom: spacing.xl },
  imageCard: { height: 230, borderRadius: radius.xl, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg, ...shadows.soft },
  image: { width: "100%", height: "100%" },
  imageText: { position: "absolute", bottom: 14, alignSelf: "center", backgroundColor: colors.white, color: colors.charcoal, overflow: "hidden", borderRadius: radius.round, paddingHorizontal: 16, paddingVertical: 8, fontWeight: "700" },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadows.soft },
  label: { color: colors.charcoal, fontSize: 18, fontWeight: "700", marginBottom: spacing.sm },
  textArea: { minHeight: 120, borderRadius: radius.md, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border, padding: spacing.md, color: colors.charcoal, fontSize: 15, lineHeight: 21, marginBottom: spacing.lg, textAlignVertical: "top" },
  saveButton: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  saveText: { color: colors.white, fontSize: 16, fontWeight: "700" },
});
