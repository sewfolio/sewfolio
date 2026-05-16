import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";

export default function EditProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Edit Profile" />

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} defaultValue="Megan" />

          <Text style={styles.label}>Handle</Text>
          <TextInput style={styles.input} defaultValue="@sewfolioapp" />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            multiline
            defaultValue="Garment sewing, quilted bags, fabric collecting, and projects that actually get finished."
          />

          <Pressable onPress={() => router.back()} style={styles.button}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
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
  heading: { fontSize: 28, color: colors.charcoal, fontWeight: "400" },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  label: { fontSize: 14, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm, marginTop: spacing.md },
  input: { height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cream, paddingHorizontal: spacing.lg, color: colors.charcoal, fontSize: 15 },
  notes: { height: 120, paddingTop: spacing.md },
  button: { height: 54, borderRadius: radius.round, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600" },
});
