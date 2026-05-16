import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { useSewfolio } from "../../src/store/sewfolioStore";

export default function WorkbookDetailScreen() {
  const { id } = useLocalSearchParams();
  const { workbooks, projects } = useSewfolio();

  const workbook = workbooks.find((item: any) => item.id === id) || workbooks[0];
  const workbookProjects = projects.filter((project: any) => project.workbookId === workbook?.id);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.heading}>{workbook?.title || "Workbook"}</Text>
          <Pressable onPress={() => router.push(`/workbooks/edit/${workbook?.id}`)} style={styles.edit}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: workbook?.tint || colors.ivory }]}>
          <Text style={styles.heroTitle}>{workbook?.title}</Text>
          <Text style={styles.heroBody}>{workbookProjects.length} saved projects</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <Pressable onPress={() => router.push("/project/import-link")}>
            <Text style={styles.link}>Add project</Text>
          </Pressable>
        </View>

        {workbookProjects.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptyBody}>Save a project into this workbook to start building your collection.</Text>
          </View>
        ) : (
          workbookProjects.map((item: any) => (
            <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/project/${item.id}`)}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{item.pattern || "Saved project"}</Text>
              </View>
            </Pressable>
          ))
        )}
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
  edit: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  editText: { color: colors.charcoal, fontSize: 13, fontWeight: "500" },
  heading: { fontSize: 25, color: colors.charcoal, fontWeight: "400", maxWidth: "60%", textAlign: "center" },
  hero: { borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.xl },
  heroTitle: { fontSize: 30, color: colors.charcoal, fontWeight: "500" },
  heroBody: { fontSize: 14, color: colors.mutedText, marginTop: spacing.sm },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  link: { fontSize: 13, color: colors.olive },
  empty: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.xl },
  emptyTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500" },
  emptyBody: { fontSize: 14, color: colors.mutedText, lineHeight: 22, marginTop: spacing.sm },
  card: { flexDirection: "row", backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  image: { width: 78, height: 78, borderRadius: radius.md, backgroundColor: colors.oatmeal },
  cardBody: { flex: 1, marginLeft: spacing.md, justifyContent: "center" },
  title: { fontSize: 17, color: colors.charcoal, fontWeight: "500" },
  meta: { fontSize: 13, color: colors.mutedText, marginTop: 4 },
});
