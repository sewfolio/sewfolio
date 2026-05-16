import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function EditFabricScreen() {
  const { id } = useLocalSearchParams();
  const { fabrics, stashCollections, updateFabric, deleteFabric } = useSewfolio();
  const fabric = fabrics.find((item: any) => item.id === id);

  const [name, setName] = useState(fabric?.name || "");
  const [amount, setAmount] = useState(fabric?.amount || fabric?.yardage || "");
  const [type, setType] = useState(fabric?.type || "");
  const [color, setColor] = useState(fabric?.color || "");
  const [brand, setBrand] = useState(fabric?.brand || "");
  const [notes, setNotes] = useState(fabric?.notes || "");
  const [image, setImage] = useState(fabric?.image || "");
  const [collectionId, setCollectionId] = useState(fabric?.collectionId || stashCollections[0]?.id || "");

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  }

  function save() {
    if (!fabric) return;

    updateFabric(fabric.id, {
      name,
      amount,
      yardage: amount,
      type,
      color,
      brand,
      notes,
      image,
      collectionId,
    });

    router.back();
  }

  function remove() {
    if (!fabric) return;
    deleteFabric(fabric.id);
    router.replace("/stash");
  }

  if (!fabric) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.heading}>Fabric not found</Text>
          <Pressable onPress={() => router.replace("/stash")} style={styles.button}>
            <Text style={styles.buttonText}>Back to Stash</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Edit Fabric</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Pressable onPress={pickImage} style={styles.imagePicker}>
            <Image source={{ uri: image }} style={styles.previewImage} />
          </Pressable>

          <Text style={styles.label}>Fabric name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="3 yards, 2 fat quarters, scraps..." placeholderTextColor={colors.mutedText} />

          <Text style={styles.label}>Type</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} />

          <Text style={styles.label}>Color / style</Text>
          <TextInput style={styles.input} value={color} onChangeText={setColor} />

          <Text style={styles.label}>Brand</Text>
          <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

          <Text style={styles.label}>Collection</Text>
          <View style={styles.collectionGrid}>
            {stashCollections.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => setCollectionId(item.id)}
                style={[styles.collectionChip, collectionId === item.id && styles.collectionChipActive]}
              >
                <Text style={collectionId === item.id ? styles.collectionTextActive : styles.collectionText}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput style={[styles.input, styles.notes]} value={notes} onChangeText={setNotes} multiline />

          <Pressable onPress={save} style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>

          <Pressable onPress={remove} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete Fabric</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 50 },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  back: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  spacer: { width: 44 },
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  imagePicker: { height: 210, borderRadius: radius.lg, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.border, overflow: "hidden", marginBottom: spacing.lg },
  previewImage: { width: "100%", height: "100%" },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  input: { height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  notes: { height: 110, paddingTop: spacing.md },
  collectionGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  collectionChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  collectionChipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  collectionText: { color: colors.charcoal, fontSize: 13 },
  collectionTextActive: { color: colors.white, fontSize: 13, fontWeight: "600" },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  deleteButton: { height: 54, borderRadius: radius.round, backgroundColor: "#F3DDD7", alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  deleteText: { color: colors.clay, fontSize: 16, fontWeight: "600" },
});
