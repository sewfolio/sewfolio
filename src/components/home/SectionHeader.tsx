import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../theme";

type Props = {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
};

export default function SectionHeader({ title, actionLabel, onPress }: Props) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {actionLabel && onPress ? (
        <Pressable onPress={onPress}>
          <Text style={styles.seeAll}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.charcoal,
    fontSize: 26,
    fontWeight: "500",
  },
  seeAll: {
    color: colors.clay,
    fontSize: 15,
    fontWeight: "700",
  },
});
