import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import BottomNav from "../BottomNav";

type Props = {
  children: React.ReactNode;
  nav?: "home" | "projects" | "stash" | "profile";
  padded?: boolean;
};

export default function ScreenShell({ children, nav, padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          padded ? styles.padded : null,
          nav ? styles.withNav : null,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {nav ? <BottomNav active={nav} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingTop: 70,
    paddingBottom: 90,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
  withNav: {
    paddingBottom: 150,
  },
});
