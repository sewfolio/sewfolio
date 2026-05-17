import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing, shadows } from "../../../src/theme";
import { createShoppingItem, deleteShoppingItem, fetchShoppingItems, updateShoppingItem } from "../../../src/services/shoppingItems";
import { useSewfolio } from "../../../src/store/sewfolioStore";

export default function ProjectShoppingListScreen() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);
  const { projects } = useSewfolio();
  const project = projects.find((item: any) => item.id === projectId);

  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  async function loadItems() {
    const data = await fetchShoppingItems(projectId);
    setItems(data);
  }

  useEffect(() => {
    loadItems();
  }, [projectId]);

  async function addItem() {
    if (!name.trim()) return;

    await createShoppingItem({
      projectId,
      name: name.trim(),
      quantity: quantity.trim(),
      category: category.trim(),
    });

    setName("");
    setQuantity("");
    setCategory("");
    await loadItems();
  }

  async function togglePurchased(item: any) {
    await updateShoppingItem(item.id, { purchased: !item.purchased });
    await loadItems();
  }

  async function editItem(id: string, updates: any) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    await updateShoppingItem(id, updates);
  }

  async function removeItem(id: string) {
    await deleteShoppingItem(id);
    await loadItems();
  }

  const remaining = items.filter((item) => !item.purchased).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Shopping List</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>PROJECT SHOPPING</Text>
          <Text style={styles.projectTitle}>{project?.title || "Project"}</Text>
          <Text style={styles.meta}>{remaining} items left to buy</Text>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>Add item</Text>

          <TextInput
            style={styles.input}
            placeholder="Item name"
            placeholderTextColor={colors.mutedText}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.twoColumn}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Qty"
              placeholderTextColor={colors.mutedText}
              value={quantity}
              onChangeText={setQuantity}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Category"
              placeholderTextColor={colors.mutedText}
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <Pressable onPress={addItem} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to List</Text>
          </Pressable>
        </View>

        <Text style={styles.listHeading}>Items</Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No shopping items yet</Text>
            <Text style={styles.emptyText}>Add fabric, notions, thread, zippers, interfacing, or tools you need for this project.</Text>
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
                <TextInput
                  value={item.name}
                  onChangeText={(text) => editItem(item.id, { name: text })}
                  style={item.purchased ? styles.itemInputDone : styles.itemInput}
                />

                <TextInput
                  value={item.quantity || ""}
                  placeholder="Quantity"
                  placeholderTextColor={colors.mutedText}
                  onChangeText={(text) => editItem(item.id, { quantity: text })}
                  style={styles.metaInput}
                />

                <TextInput
                  value={item.category || ""}
                  placeholder="Category"
                  placeholderTextColor={colors.mutedText}
                  onChangeText={(text) => editItem(item.id, { category: text })}
                  style={styles.metaInput}
                />
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  back: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  spacer: { width: 44 },
  heading: { fontSize: 30, color: colors.charcoal, fontWeight: "400" },

  heroCard: { backgroundColor: "#F3DDD7", borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.lg, ...shadows.soft },
  eyebrow: { color: colors.clay, fontSize: 13, letterSpacing: 2, fontWeight: "700", marginBottom: spacing.sm },
  projectTitle: { color: colors.charcoal, fontSize: 28, lineHeight: 34, fontWeight: "500" },
  meta: { color: colors.mutedText, fontSize: 16, marginTop: spacing.sm },

  addCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.xl, ...shadows.soft },
  sectionTitle: { color: colors.charcoal, fontSize: 22, fontWeight: "500", marginBottom: spacing.md },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15, marginBottom: spacing.md },
  twoColumn: { flexDirection: "row", gap: spacing.sm },
  halfInput: { flex: 1 },
  addButton: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  addButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" },

  listHeading: { color: colors.charcoal, fontSize: 26, fontWeight: "500", marginBottom: spacing.md },
  emptyCard: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  emptyTitle: { color: colors.charcoal, fontSize: 22, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: colors.mutedText, fontSize: 15, lineHeight: 22 },

  itemRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  checkbox: { width: 34, height: 34, borderRadius: radius.round, borderWidth: 2, borderColor: colors.sage, alignItems: "center", justifyContent: "center" },
  checkboxDone: { width: 34, height: 34, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.white, fontSize: 18, fontWeight: "700" },
  itemBody: { flex: 1, paddingHorizontal: spacing.md },
  itemInput: { color: colors.charcoal, fontSize: 18, fontWeight: "600", paddingVertical: 0 },
  itemInputDone: { color: colors.mutedText, fontSize: 18, fontWeight: "600", textDecorationLine: "line-through", paddingVertical: 0 },
  metaInput: { color: colors.mutedText, fontSize: 13, marginTop: 4, paddingVertical: 0 },
  deleteButton: { backgroundColor: "#F3DDD7", borderRadius: radius.round, paddingHorizontal: 14, paddingVertical: 8 },
  deleteText: { color: colors.clay, fontSize: 12, fontWeight: "700" },
});
