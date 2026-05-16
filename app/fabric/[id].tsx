import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing, shadows } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";

export default function FabricDetailScreen() {
  const { id } = useLocalSearchParams();
  const { fabrics, projects, updateProject } = useSewfolio();

  const fabric = fabrics.find((item: any) => item.id === id) || fabrics[0];
  const assignedProjects = projects.filter((project: any) =>
    (project.fabricIds || (project.fabricId ? [project.fabricId] : [])).includes(fabric.id)
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.heading}>Fabric Details</Text>

          <Pressable onPress={() => router.push(`/fabric/edit/${fabric.id}`)} style={styles.edit}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Image source={{ uri: fabric.image }} style={styles.image} />

          <View style={styles.heroBody}>
            <Text style={styles.title}>{fabric.name}</Text>
            <Text style={styles.meta}>
              {[fabric.amount || fabric.yardage, fabric.color, fabric.type, fabric.brand]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fabric Info</Text>

          <InfoRow label="Amount" value={fabric.amount || fabric.yardage || "Not set"} />
          <InfoRow label="Type" value={fabric.type || "Not set"} />
          <InfoRow label="Color / style" value={fabric.color || "Not set"} />
          <InfoRow label="Brand" value={fabric.brand || "Not set"} />
          <InfoRow label="Notes" value={fabric.notes || "No notes yet"} last />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Linked Projects</Text>
            <Text style={styles.count}>{assignedProjects.length}</Text>
          </View>

          {assignedProjects.length === 0 ? (
            <Text style={styles.emptyText}>No projects are using this fabric yet.</Text>
          ) : (
            assignedProjects.map((project: any) => (
              <Pressable
                key={project.id}
                style={styles.projectRow}
                onPress={() => router.push(`/project/${project.id}`)}
              >
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectSub}>Assigned fabric</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assign to Project</Text>
            <Text style={styles.count}>{projects.length}</Text>
          </View>

          <Text style={styles.emptyText}>
            Choose one project from a searchable list instead of showing every project here.
          </Text>

          <Pressable
            onPress={() => router.push(`/fabric/assign/${fabric.id}`)}
            style={styles.assignButton}
          >
            <Text style={styles.assignButtonText}>Assign to Project</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={last ? styles.infoRowLast : styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { paddingTop: 70, paddingHorizontal: spacing.lg, paddingBottom: 50 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  backText: { fontSize: 34, color: colors.charcoal, marginTop: -4 },
  heading: { fontSize: 26, color: colors.charcoal, fontWeight: "400" },
  edit: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editText: { color: colors.charcoal, fontSize: 13, fontWeight: "500" },

  heroCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.oatmeal,
  },
  heroBody: { paddingTop: spacing.lg, paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
  title: { fontSize: 30, color: colors.charcoal, fontWeight: "500" },
  meta: { fontSize: 15, color: colors.mutedText, marginTop: 6, lineHeight: 22 },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.md },
  count: { fontSize: 13, color: colors.mutedText },

  infoRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: { paddingTop: spacing.md },
  infoLabel: { fontSize: 13, color: colors.mutedText, marginBottom: 4 },
  infoValue: { fontSize: 16, color: colors.charcoal, lineHeight: 22 },

  emptyText: { fontSize: 15, color: colors.mutedText, lineHeight: 22 },
  projectRow: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  projectTitle: { fontSize: 15, color: colors.charcoal, fontWeight: "500" },
  projectSub: { fontSize: 12, color: colors.mutedText, marginTop: 3 },

  assignOption: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  assignOptionActive: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: colors.sage,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  assignTitle: { fontSize: 15, color: colors.charcoal, fontWeight: "500" },
  assignTitleActive: { fontSize: 15, color: colors.white, fontWeight: "600" },
  assignSub: { fontSize: 12, color: colors.mutedText, marginTop: 3 },
  assignButton: {
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  assignButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  assignSubActive: { fontSize: 12, color: colors.white, marginTop: 3 },
});
