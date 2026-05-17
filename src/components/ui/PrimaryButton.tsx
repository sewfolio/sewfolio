import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../../theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export default function PrimaryButton({ title, onPress, loading = false, disabled = false, variant = "primary" }: Props) {
  const style =
    variant === "danger"
      ? styles.danger
      : variant === "secondary"
      ? styles.secondary
      : styles.primary;

  const textStyle =
    variant === "secondary"
      ? styles.secondaryText
      : styles.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style, (disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={variant === "secondary" ? colors.charcoal : colors.white} /> : <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.sage,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.clay,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: colors.charcoal,
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
});
