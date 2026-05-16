import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [aiHelp, setAiHelp] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Header title="Settings" />

        <View style={styles.card}>
          <SettingRow title="Notifications" subtitle="Project reminders and saved item updates" value={notifications} onValueChange={setNotifications} />
          <SettingRow title="Private profile" subtitle="Keep your maker profile hidden" value={privateProfile} onValueChange={setPrivateProfile} />
          <SettingRow title="AI assistance" subtitle="Allow Sewfolio to suggest project organization" value={aiHelp} onValueChange={setAiHelp} last />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.row}>Default project view</Text>
          <Text style={styles.row}>Measurement units</Text>
          <Text style={styles.rowLast}>Theme</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ title, subtitle, value, onValueChange, last }: any) {
  return (
    <View style={last ? styles.settingRowLast : styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSub}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
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
  settingRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingRowLast: { flexDirection: "row", alignItems: "center", paddingTop: spacing.md },
  settingTitle: { fontSize: 16, color: colors.charcoal, fontWeight: "500" },
  settingSub: { fontSize: 12, color: colors.mutedText, marginTop: 3 },
  sectionTitle: { fontSize: 20, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  row: { fontSize: 16, color: colors.charcoal, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLast: { fontSize: 16, color: colors.charcoal, paddingTop: spacing.md },
});
