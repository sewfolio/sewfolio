import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../src/theme";

export default function Index() {
  const [ready, setReady] = useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => setReady(true), 1900);
    return () => clearTimeout(timer);
  }, []);

  if (ready) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/sewfolio-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>Save every idea. Track every make.</Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        <Text style={styles.loadingText}>Loading your sewing workspace</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 360,
    height: 280,
    marginBottom: 8,
  },
  text: {
    color: colors.clay,
    fontSize: 15,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  progressTrack: {
    width: 230,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.oatmeal,
    overflow: "hidden",
    marginTop: 28,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.sage,
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
  },
});
