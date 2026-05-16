
import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Image source={require("../../assets/images/sewfolio-logo.png")} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.tagline}>Save every idea. Track every make.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to your sewing workspace.</Text>

          <TextInput
            placeholder="Email address"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            secureTextEntry
          />

          <Pressable onPress={() => router.replace("/(tabs)")} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Log In</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/(tabs)")} style={styles.demoButton}>
            <Text style={styles.demoText}>Use Demo Account</Text>
          </Pressable>

          <Text style={styles.createText}>New to Sewfolio? Create an account</Text>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: -40,
  },
  logoImage: {
    width: 420,
    height: 320,
    marginBottom: -10,
  },
  tagline: {
    textAlign: "center",
    color: colors.clay,
    fontSize: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  title: {
    fontSize: 28,
    color: colors.charcoal,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.mutedText,
    marginBottom: spacing.xl,
  },
  input: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  primaryButton: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  demoButton: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  demoText: {
    color: colors.charcoal,
    fontSize: 15,
    fontWeight: "500",
  },
  createText: {
    textAlign: "center",
    color: colors.clay,
    fontSize: 14,
    marginTop: spacing.xl,
  },
  footer: {
    textAlign: "center",
    color: colors.mutedText,
    fontSize: 15,
    fontStyle: "italic",
    marginTop: spacing.xl,
  },
});
