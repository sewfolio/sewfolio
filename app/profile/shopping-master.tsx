import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { deleteShoppingItem, fetchShoppingItems, updateShoppingItem } from "../../src/services/shoppingItems";
import { useSewfolio } from "../../src/store/sewfolioStore";

export default function ShoppingMasterScreen() {
  const { projects } = useSewfolio();
  const [items, setItems] = useState<any[]>([]);

  async function loadItems() {
    const data = await fetchShoppingItems();
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, []);

  function projectTitle(projectId?: string) {
    if (!projectId) return "General";
    return projects.find((project: any) => project.id === projectId)?.title || "General";
  }

  async function togglePurchased(item: any) {
    await updateShoppingItem(item.id, { purchased: !item.purchased });
    await loadItems();
  }

  async function removeItem(id: string) {
    await deleteShoppingItem(id);
    await loadItems();
  }

  const remaining = items.filter((item) => !item.purchased).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>MASTER LIST</Text>
        <Text style={styles.heading}>Shopping List</Text>
        <Text style={styles.subhead}>{remaining} items left to buy</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No shopping items yet</Text>
            <Text style={styles.emptyText}>Add items from any project shopping list and they will appear here.</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Pressable
                onPress={() => togglePurchased(item)}
                style={item.purchased ? styles.checkboxDone : styles.checkbox}
              >
                <Text style={styles.checkText}>{item.purchased ? "✓" : ""}</Text>
              </Pressable>

              <View style={styles.itemBody}>
                <Text style={item.purchased ? styles.itemTitleDone : styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {[item.quantity, item.category, projectTitle(item.project_id)].filter(Boolean).join(" · ")}
                </Text>
              </View>

              <Pressable onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
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
  back: { width: 52, height: 52, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
  backText: { fontSize: 38, color: colors.charcoal, marginTop: -4 },
  eyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2.4, fontWeight: "700", marginBottom: 8 },
  heading: { color: colors.charcoal, fontSize: 44, fontWeight: "400" },
  subhead: { color: colors.mutedText, fontSize: 16, marginTop: spacing.sm, marginBottom: spacing.xl },
  emptyCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadows.soft },
  emptyTitle: { color: colors.charcoal, fontSize: 23, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
  itemRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, ...shadows.soft },
  checkbox: { width: 34, height: 34, borderRadius: radius.round, borderWidth: 2, borderColor: colors.sage, alignItems: "center", justifyContent: "center" },
  checkboxDone: { width: 34, height: 34, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.white, fontSize: 18, fontWeight: "700" },
  itemBody: { flex: 1, paddingHorizontal: spacing.md },
  itemTitle: { color: colors.charcoal, fontSize: 18, fontWeight: "600" },
  itemTitleDone: { color: colors.mutedText, fontSize: 18, fontWeight: "600", textDecorationLine: "line-through" },
  itemMeta: { color: colors.mutedText, fontSize: 13, marginTop: 4 },
  deleteButton: { backgroundColor: "#F3DDD7", borderRadius: radius.round, paddingHorizontal: 14, paddingVertical: 8 },
  deleteText: { color: colors.clay, fontSize: 12, fontWeight: "700" },
});
