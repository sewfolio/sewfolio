import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";

export default function NewFabricScreen() {
  const { addFabric, stashCollections, addStashCollection } = useSewfolio();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");
  const [collectionId, setCollectionId] = useState(stashCollections[0]?.id || "");
  const [brand, setBrand] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

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

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  function createCollection() {
    if (!newCollectionName.trim()) return;

    const title = newCollectionName.trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `collection-${Date.now()}`;

    addStashCollection({
      id,
      title,
      tint: "#F3DDD7",
    });

    setCollectionId(id);
    setNewCollectionName("");
  }

  function saveFabric() {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `fabric-${Date.now()}`;

    addFabric({
      id,
      name: name || "Untitled Fabric",
      amount: amount || "Unknown amount",
      type,
      color,
      brand,
      notes,
      collectionId,
      image: image || "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500",
    });

    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Add Fabric</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <View style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderTitle}>Add fabric photo</Text>
                <Text style={styles.imagePlaceholderSub}>Choose a photo or take one now</Text>
              </View>
            )}
          </View>

          <View style={styles.photoActions}>
            <Pressable onPress={pickImage} style={styles.photoButton}>
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </Pressable>

            <Pressable onPress={takePhoto} style={styles.photoButtonSecondary}>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Fabric name</Text>
          <TextInput style={styles.input} placeholder="Washed linen" placeholderTextColor={colors.mutedText} value={name} onChangeText={setName} />

          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.input} placeholder="3 amount, 2 fat quarters, jelly roll, scraps..." placeholderTextColor={colors.mutedText} value={amount} onChangeText={setAmount} />

          <Text style={styles.label}>Type</Text>
          <TextInput style={styles.input} placeholder="Linen, cotton, wool..." placeholderTextColor={colors.mutedText} value={type} onChangeText={setType} />

          <Text style={styles.label}>Color / style</Text>
          <TextInput style={styles.input} placeholder="Oatmeal, floral, grunge, solid..." placeholderTextColor={colors.mutedText} value={color} onChangeText={setColor} />

          <Text style={styles.label}>Brand</Text>
          <TextInput style={styles.input} placeholder="Rifle Paper Co., Moda, Liberty..." placeholderTextColor={colors.mutedText} value={brand} onChangeText={setBrand} />

          <Text style={styles.label}>Collection</Text>
          <View style={styles.collectionGrid}>
            {stashCollections.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => setCollectionId(item.id)}
                style={[
                  styles.collectionChip,
                  collectionId === item.id && styles.collectionChipActive,
                ]}
              >
                <Text style={collectionId === item.id ? styles.collectionTextActive : styles.collectionText}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.newCollectionBox}>
            <TextInput
              style={styles.input}
              placeholder="Create new collection"
              placeholderTextColor={colors.mutedText}
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <Pressable onPress={createCollection} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Create Collection</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            placeholder="Prewashed, project ideas, where you bought it..."
            placeholderTextColor={colors.mutedText}
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <Pressable onPress={saveFabric} style={styles.button}>
            <Text style={styles.buttonText}>Save Fabric</Text>
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
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  imagePicker: { height: 210, borderRadius: radius.lg, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg },
  previewImage: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  imagePlaceholderTitle: { fontSize: 18, color: colors.charcoal, fontWeight: "500" },
  imagePlaceholderSub: { fontSize: 13, color: colors.mutedText, marginTop: 6 },
  photoActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  photoButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonSecondary: {
    flex: 1,
    height: 46,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtonText: {
    color: colors.charcoal,
    fontSize: 14,
    fontWeight: "600",
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  collectionChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  collectionChipActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  collectionText: {
    color: colors.charcoal,
    fontSize: 13,
  },
  collectionTextActive: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  newCollectionBox: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  secondaryText: {
    color: colors.charcoal,
    fontSize: 14,
    fontWeight: "600",
  },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  input: { height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  notes: { height: 110, paddingTop: spacing.md },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
