import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";

const initialItems = ["Invisible zipper", "Matching thread", "Lightweight interfacing", "Cotton webbing"];

export default function ShoppingListScreen() {
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Shopping List" />
        <View style={styles.card}>
          {initialItems.map((item) => (
            <Pressable
              key={item}
              style={styles.row}
              onPress={() =>
                setChecked((current) =>
                  current.includes(item) ? current.filter((x) => x !== item) : [...current, item]
                )
              }
            >
              <View style={checked.includes(item) ? styles.checkActive : styles.check}>
                <Text style={styles.checkText}>{checked.includes(item) ? "✓" : ""}</Text>
              </View>
              <Text style={checked.includes(item) ? styles.itemChecked : styles.item}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.spacer} />
    </View>
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
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  check: { width: 26, height: 26, borderRadius: radius.round, borderWidth: 1, borderColor: colors.border },
  checkActive: { width: 26, height: 26, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.white, fontWeight: "600" },
  item: { fontSize: 16, color: colors.charcoal },
  itemChecked: { fontSize: 16, color: colors.mutedText, textDecorationLine: "line-through" },
});
