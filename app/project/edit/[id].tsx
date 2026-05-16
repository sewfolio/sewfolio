import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../../src/theme";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams();
  const { projects, workbooks, updateProject } = useSewfolio();
  const project = projects.find((item: any) => item.id === id) || projects[0];

  const [title, setTitle] = useState(project.title || "");
  const [pattern, setPattern] = useState(project.pattern || "");
  const [fabric, setFabric] = useState(project.fabric || "");
  const [dueDate, setDueDate] = useState(project.dueDate || "");
  const [notes, setNotes] = useState(project.notes || "");
  const [workbookId, setWorkbookId] = useState(project.workbookId || workbooks[0]?.id || "");

  function save() {
    updateProject(String(project.id), {
      title,
      pattern,
      fabric,
      dueDate,
      notes,
      workbookId,
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
          <Text style={styles.heading}>Edit Project</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Project name</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Workbook</Text>
          <View style={styles.workbookGrid}>
            {workbooks.map((item: any) => (
              <Pressable
                key={item.id}
                onPress={() => setWorkbookId(item.id)}
                style={[styles.workbookChip, workbookId === item.id && styles.workbookChipActive]}
              >
                <Text style={[styles.workbookChipText, workbookId === item.id && styles.workbookChipTextActive]}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Pattern</Text>
          <TextInput style={styles.input} value={pattern} onChangeText={setPattern} placeholder="Pattern name or source" placeholderTextColor={colors.mutedText} />

          <Text style={styles.label}>Fabric</Text>
          <TextInput style={styles.input} value={fabric} onChangeText={setFabric} placeholder="Fabric used" placeholderTextColor={colors.mutedText} />

          <Text style={styles.label}>Due date</Text>
          <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} placeholder="Not set" placeholderTextColor={colors.mutedText} />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Project notes"
            placeholderTextColor={colors.mutedText}
          />

          <Pressable onPress={save} style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
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
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  input: { height: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  notes: { height: 120, paddingTop: spacing.md },
  workbookGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  workbookChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  workbookChipActive: { backgroundColor: colors.sage, borderColor: colors.sage },
  workbookChipText: { fontSize: 13, color: colors.charcoal },
  workbookChipTextActive: { color: colors.white, fontWeight: "600" },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
