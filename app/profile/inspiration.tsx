import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { createInspirationItem, deleteInspirationItem, fetchInspirationItems } from "../../src/services/inspiration";
import { uploadImageToStorage } from "../../src/services/imageUpload";
import { placeholderProject } from "../../src/utils/placeholders";

export default function InspirationScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    const data = await fetchInspirationItems();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

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

  async function saveItem() {
    if (!title.trim() || saving) return;

    setSaving(true);

    try {
      const uploadedImage = image ? await uploadImageToStorage(image, "inspiration") : "";

      await createInspirationItem({
        title: title.trim(),
        sourceUrl,
        notes,
        imageUrl: uploadedImage,
        type: image ? "image" : sourceUrl ? "link" : "note",
      });

      setTitle("");
      setSourceUrl("");
      setNotes("");
      setImage("");

      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    await deleteInspirationItem(id);
    await loadItems();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Saved Inspiration</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.createCard}>
          <Text style={styles.sectionTitle}>Add inspiration</Text>

          <Pressable onPress={pickImage} style={styles.imagePicker}>
            <Image source={image ? { uri: image } : placeholderProject} style={styles.previewImage} />
            <Text style={styles.imageText}>Tap to add image</Text>
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={colors.mutedText}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="TikTok, Instagram, Pinterest, YouTube, or blog link"
            placeholderTextColor={colors.mutedText}
            value={sourceUrl}
            onChangeText={setSourceUrl}
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes, fabric ideas, details to remember..."
            placeholderTextColor={colors.mutedText}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <Pressable onPress={saveItem} style={[styles.saveButton, saving && styles.disabled]}>
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save Inspiration"}</Text>
          </Pressable>
        </View>

        <Text style={styles.listTitle}>Your ideas</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No inspiration saved yet</Text>
            <Text style={styles.emptyText}>Save TikToks, screenshots, links, outfits, fabric combos, and ideas before they become projects.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={item.image_url ? { uri: item.image_url } : placeholderProject} style={styles.itemImage} />

              <View style={styles.itemBody}>
                <Text style={styles.itemType}>{item.type || "idea"}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/project/import-link",
                        params: { sourceUrl: item.source_url || "", title: item.title },
                      })
                    }
                    style={styles.convertButton}
                  >
                    <Text style={styles.convertText}>Convert to Project</Text>
                  </Pressable>

                  <Pressable onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 90 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  back: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  spacer: { width: 44 },
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },

  createCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.xl, ...shadows.soft },
  sectionTitle: { color: colors.charcoal, fontSize: 22, fontWeight: "500", marginBottom: spacing.md },
  imagePicker: { height: 210, borderRadius: radius.lg, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.md },
  previewImage: { width: "100%", height: "100%" },
  imageText: { position: "absolute", bottom: 12, alignSelf: "center", backgroundColor: colors.white, color: colors.charcoal, overflow: "hidden", borderRadius: radius.round, paddingHorizontal: 14, paddingVertical: 7, fontSize: 13, fontWeight: "600" },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, color: colors.charcoal, fontSize: 15, marginBottom: spacing.md },
  textArea: { height: 120, textAlignVertical: "top" },
  saveButton: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  saveText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.65 },

  listTitle: { color: colors.charcoal, fontSize: 26, fontWeight: "500", marginBottom: spacing.md },
  emptyCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  emptyTitle: { color: colors.charcoal, fontSize: 22, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },

  itemCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.md, ...shadows.soft },
  itemImage: { width: "100%", height: 190, backgroundColor: colors.oatmeal },
  itemBody: { padding: spacing.lg },
  itemType: { color: colors.clay, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: "700", marginBottom: 6 },
  itemTitle: { color: colors.charcoal, fontSize: 23, lineHeight: 29, fontWeight: "500" },
  itemNotes: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  convertButton: { flex: 1, height: 46, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  convertText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  deleteButton: { height: 46, borderRadius: radius.round, backgroundColor: "#F3DDD7", paddingHorizontal: 18, alignItems: "center", justifyContent: "center" },
  deleteText: { color: colors.clay, fontSize: 13, fontWeight: "700" },
});
