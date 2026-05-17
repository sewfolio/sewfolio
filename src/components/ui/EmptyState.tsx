import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, shadows } from "../../theme";

type Props = {
  title: string;
  text: string;
  actionLabel?: string;
  onPress?: () => void;
};

export default function EmptyState({ title, text, actionLabel, onPress }: Props) {
  const Container = onPress ? Pressable : View;

  return (
    <Container style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>

      {actionLabel ? (
        <View style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </View>
      ) : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.soft,
  },
  title: {
    color: colors.charcoal,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23,
  },
  action: {
    alignSelf: "flex-start",
    backgroundColor: colors.sage,
    borderRadius: radius.round,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: spacing.lg,
  },
  actionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
