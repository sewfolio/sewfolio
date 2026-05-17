import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../theme";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
};

export default function PageHeader({ eyebrow, title, subtitle, showBack = false, showLogo = false }: Props) {
  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : null}

      <View style={styles.row}>
        <View style={styles.textBlock}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {showLogo ? (
          <Image source={require("../../../assets/images/sewfolio-mark.png")} style={styles.logo} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  eyebrow: {
    color: colors.clay,
    fontSize: 13,
    letterSpacing: 2.4,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.charcoal,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: "400",
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  logo: {
    width: 76,
    height: 76,
    resizeMode: "contain",
  },
  back: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  backText: {
    fontSize: 38,
    color: colors.charcoal,
    marginTop: -4,
  },
});
