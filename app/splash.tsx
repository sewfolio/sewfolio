import React, { useEffect } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, spacing } from "../src/theme";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Image source={require("../assets/images/sewfolio-mark.png")} style={styles.logo} />
        <Text style={styles.title}>Sewfolio</Text>
        <Text style={styles.tagline}>Your sewing life, beautifully organized.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  logo: { width: 150, height: 150, resizeMode: "contain", marginBottom: spacing.lg },
  title: { fontSize: 48, color: colors.charcoal, fontWeight: "600" },
  tagline: { marginTop: spacing.sm, fontSize: 15, color: colors.mutedText, textAlign: "center" },
});
