import React, { useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { colors, radius, spacing } from "../../src/theme";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign in failed", error.message);
      return;
    }

    router.replace("/(tabs)");
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }

    Alert.alert("Check your email", "Confirm your email, then sign in.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome to Sewfolio</Text>
        <Text style={styles.body}>Sign in to sync your projects, stash, and workbooks.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.mutedText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.mutedText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={signIn} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Sign In</Text>
        </Pressable>

        <Pressable onPress={signUp} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Create Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: spacing.xl },
  heading: { fontSize: 34, color: colors.charcoal, fontWeight: "500", marginBottom: spacing.sm },
  body: { fontSize: 15, color: colors.mutedText, lineHeight: 22, marginBottom: spacing.xl },
  input: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    color: colors.charcoal,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  primaryButton: {
    height: 54,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    height: 54,
    borderRadius: radius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  secondaryText: { color: colors.charcoal, fontSize: 16, fontWeight: "600" },
});
