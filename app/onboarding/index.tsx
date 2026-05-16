import React, { useState } from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme";
import { placeholderProject } from "../../src/utils/placeholders";

const ONBOARDING_KEY = "sewfolio-onboarding-complete";

const slides = [
  {
    title: "Save sewing projects from anywhere",
    body: "Import tutorials, patterns, blog posts, and ideas into one clean project library.",
  },
  {
    title: "Keep your stash organized",
    body: "Track fabric, notions, amounts, brands, and photos so you know what you already have.",
  },
  {
    title: "Match projects to fabric",
    body: "Assign stash items to projects and keep materials, steps, notes, and source links together.",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  async function finish() {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)");
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }

    setIndex((current) => current + 1);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Image source={placeholderProject} style={styles.image} />

        <View style={styles.dots}>
          {slides.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={dotIndex === index ? styles.dotActive : styles.dot}
            />
          ))}
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>

        <Pressable onPress={next} style={styles.button}>
          <Text style={styles.buttonText}>{isLast ? "Start Sewing" : "Next"}</Text>
        </Pressable>

        {!isLast ? (
          <Pressable onPress={finish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
  },
  title: {
    fontSize: 34,
    color: colors.charcoal,
    fontWeight: "500",
    lineHeight: 40,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 16,
    color: colors.mutedText,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  button: {
    height: 56,
    borderRadius: radius.round,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  skipText: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "500",
  },
});
