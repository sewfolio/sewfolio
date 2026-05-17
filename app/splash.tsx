import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, radius, spacing } from "../src/theme";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setPercent(Math.round(value * 100));
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 1300,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/(tabs)");
    });

    return () => progress.removeListener(listener);
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Image source={require("../assets/images/sewfolio-logo.png")} style={styles.logo} />
        <Text style={styles.tagline}>Loading your sewing workspace...</Text>

        <View style={styles.progressOuter}>
          <Animated.View style={[styles.progressInner, { width }]} />
        </View>

        <Text style={styles.percent}>{percent}%</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  logo: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: -10,
  },
  title: { fontSize: 52, color: colors.charcoal, fontWeight: "400", letterSpacing: -1 },
  tagline: {
    marginTop: -12,
    fontSize: 15,
    color: colors.mutedText,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  progressOuter: { width: "82%", height: 12, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  progressInner: { height: "100%", backgroundColor: colors.sage, borderRadius: radius.round },
  percent: { marginTop: spacing.md, color: colors.clay, fontSize: 13, fontWeight: "700" },
});
