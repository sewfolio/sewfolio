import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { spacing } from "../../theme";

export default function QuickActions() {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.push("/project/import-link")} style={styles.button}>
        <Image
          source={require("../../../assets/images/import-project-button.png")}
          style={styles.image}
        />
      </Pressable>

      <Pressable onPress={() => router.push("/profile/inspiration")} style={styles.button}>
        <Image
          source={require("../../../assets/images/save-inspiration-button.png")}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
});
