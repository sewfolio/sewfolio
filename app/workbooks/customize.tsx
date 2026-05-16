import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";

const tints = ["#F3DDD7", "#EFECE2", "#F5EFE9", "#E9E5D9"];

export default function CustomizeWorkbooksScreen() {
  const { workbooks, addWorkbook, updateWorkbook, deleteWorkbook } = useSewfolio();
  const [newWorkbook, setNewWorkbook] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  function createWorkbook() {
    if (!newWorkbook.trim()) return;

    const title = newWorkbook.trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `workbook-${Date.now()}`;

    addWorkbook({
      id,
      title,
      tint: tints[Math.floor(Math.random() * tints.length)],
    });

    setNewWorkbook("");
  }

  function startEdit(item: any) {
    setEditingId(item.id);
    setEditingTitle(item.title);
  }

  function saveEdit() {
    if (!editingTitle.trim()) return;
    updateWorkbook(editingId, editingTitle.trim());
    setEditingId("");
    setEditingTitle("");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Customize</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create a workbook</Text>
          <Text style={styles.body}>Group projects by season, pattern type, fabric, or anything useful.</Text>

          <TextInput
            style={styles.input}
            placeholder="Capsule wardrobe, kids clothes, gifts..."
            placeholderTextColor={colors.mutedText}
            value={newWorkbook}
            onChangeText={setNewWorkbook}
          />

          <Pressable onPress={createWorkbook} style={styles.button}>
            <Text style={styles.buttonText}>Add Workbook</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Current Workbooks</Text>

        {workbooks.map((item: any) => (
          <View key={item.id} style={styles.row}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={editingTitle}
                  onChangeText={setEditingTitle}
                />
                <View style={styles.actions}>
                  <Pressable onPress={saveEdit} style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                  </Pressable>
                  <Pressable onPress={() => setEditingId("")} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Pressable onPress={() => router.push(`/workbooks/${item.id}`)} style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub}>Open workbook</Text>
                </Pressable>

                <View style={styles.actions}>
                  <Pressable onPress={() => startEdit(item)} style={styles.smallButton}>
                    <Text style={styles.smallButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => deleteWorkbook(item.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        ))}
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
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.xl },
  title: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  body: { fontSize: 14, color: colors.mutedText, lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.lg },
  input: { height: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  button: { height: 52, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  buttonText: { color: colors.white, fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.md },
  row: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  rowTitle: { fontSize: 17, color: colors.charcoal, fontWeight: "500" },
  rowSub: { fontSize: 12, color: colors.mutedText, marginTop: 4 },
  actions: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  smallButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.round, backgroundColor: colors.ivory, borderWidth: 1, borderColor: colors.border },
  smallButtonText: { color: colors.charcoal, fontSize: 12, fontWeight: "500" },
  deleteButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.round, backgroundColor: "#F3DDD7", borderWidth: 1, borderColor: colors.border },
  deleteText: { color: colors.clay, fontSize: 12, fontWeight: "600" },
  editInput: { flex: 1, height: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.md, color: colors.charcoal, fontSize: 15 },
  saveButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.round, backgroundColor: colors.sage },
  saveText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  cancelText: { color: colors.charcoal, fontSize: 12, fontWeight: "500" },
});
