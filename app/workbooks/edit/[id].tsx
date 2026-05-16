import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function EditWorkbookScreen() {
  const { id } = useLocalSearchParams();
  const { workbooks, updateWorkbook, deleteWorkbook } = useSewfolio();
  const workbook = workbooks.find((item: any) => item.id === id);
  const [title, setTitle] = useState(workbook?.title || "");

  function save() {
    if (!workbook || !title.trim()) return;
    updateWorkbook(workbook.id, title.trim());
    router.back();
  }

  function remove() {
    if (!workbook) return;
    deleteWorkbook(workbook.id);
    router.replace("/(tabs)/explore");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Edit Workbook</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Workbook name</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Workbook name"
            placeholderTextColor={colors.mutedText}
          />

          <Pressable onPress={save} style={styles.button}>
            <Text style={styles.buttonText}>Save Workbook</Text>
          </Pressable>

          <Pressable onPress={remove} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete Workbook</Text>
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
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  input: { height: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  deleteButton: { height: 54, borderRadius: radius.round, backgroundColor: "#F3DDD7", alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  deleteText: { color: colors.clay, fontSize: 16, fontWeight: "600" },
});
