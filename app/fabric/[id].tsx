import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { fabrics } from "../../src/data/mockData";

export default function FabricDetailScreen() {
  const { id } = useLocalSearchParams();
  const fabric = fabrics.find((item: any) => item.id === id) || fabrics[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>Fabric Details</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Image source={{ uri: fabric.image }} style={styles.image} />
          <Text style={styles.title}>{fabric.name}</Text>
          <Text style={styles.meta}>{fabric.yardage} · Neutral · Garment weight</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fabric Info</Text>
          <Text style={styles.row}>Yardage: {fabric.yardage}</Text>
          <Text style={styles.row}>Type: Linen / Cotton</Text>
          <Text style={styles.row}>Color: Oatmeal / Neutral</Text>
          <Text style={styles.row}>Weight: Garment weight</Text>
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
  heading: { fontSize: 26, color: colors.charcoal, fontWeight: "400" },
  spacer: { width: 44 },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  image: { width: "100%", height: 240, borderRadius: radius.lg, backgroundColor: colors.oatmeal, marginBottom: spacing.lg },
  title: { fontSize: 30, color: colors.charcoal, fontWeight: "500" },
  meta: { fontSize: 15, color: colors.mutedText, marginTop: 6 },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.md },
  row: { fontSize: 15, color: colors.charcoal, paddingVertical: spacing.sm },
});
