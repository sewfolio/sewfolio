import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { deleteShoppingItem, fetchShoppingItems, updateShoppingItem } from "../../src/services/shoppingItems";
import { useSewfolio } from "../../src/store/sewfolioStore";
import ScreenShell from "../../src/components/ui/ScreenShell";
import PageHeader from "../../src/components/ui/PageHeader";
import EmptyState from "../../src/components/ui/EmptyState";

export default function ShoppingMasterScreen() {
  const { projects } = useSewfolio();
  const [items, setItems] = useState<any[]>([]);

  async function loadItems() {
    setItems(await fetchShoppingItems());
  }

  useEffect(() => {
    loadItems();
  }, []);

  const remaining = items.filter((item) => !item.purchased).length;

  return (
    <ScreenShell>
      <PageHeader showBack eyebrow="Master List" title="Shopping List" subtitle={`${remaining} items left to buy`} />

      {items.length === 0 ? (
        <EmptyState title="No shopping items yet" text="Add items from any project shopping list and they will appear here." />
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Pressable onPress={async () => { await updateShoppingItem(item.id, { purchased: !item.purchased }); await loadItems(); }} style={item.purchased ? styles.checkboxDone : styles.checkbox}>
              <Text style={styles.checkText}>{item.purchased ? "✓" : ""}</Text>
            </Pressable>

            <View style={styles.itemBody}>
              <Text style={item.purchased ? styles.itemTitleDone : styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {[item.quantity, item.category, projects.find((p: any) => p.id === item.project_id)?.title || "General"].filter(Boolean).join(" · ")}
              </Text>
            </View>

            <Pressable onPress={async () => { await deleteShoppingItem(item.id); await loadItems(); }} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
