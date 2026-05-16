import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Help" />

        <View style={styles.card}>
          <Text style={styles.title}>Getting started</Text>
          <Text style={styles.body}>Add projects, save inspiration, track fabric, and organize your sewing workflow.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Contact support</Text>
          <Text style={styles.body}>support@sewfolio.app</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Version</Text>
          <Text style={styles.body}>Sewfolio MVP Preview</Text>
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
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: 19, color: colors.charcoal, fontWeight: "500" },
  body: { fontSize: 14, color: colors.mutedText, lineHeight: 22, marginTop: spacing.sm },
});
