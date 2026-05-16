import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Texture lines — subtle background detail */}
      <View style={styles.textureContainer}>
        {Array.from({ length: 24 }).map((_, i) => (
          <View key={i} style={[styles.textureLine, { top: (i * height) / 24 }]} />
        ))}
      </View>

      {/* Top wordmark */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>Sewfolio</Text>
      </View>

      {/* Main content — bottom anchored */}
      <View style={styles.content}>
        <View style={styles.heroText}>
          <Text style={styles.tagline}>
            A workspace for{'\n'}everything you make.
          </Text>
          <Text style={styles.description}>
            Save patterns, track projects, and build your creative archive — beautifully.
          </Text>
        </View>

        {/* Feature list */}
        <View style={styles.features}>
          {[
            'Save from any link or upload',
            'AI-powered pattern parsing',
            'Track progress from saved to finished',
          ].map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.82 }]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.primaryBtnText}>Get started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.secondaryBtnText}>Sign in to your account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  textureContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  textureLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: Colors.oatmeal,
    opacity: 0.7,
  },
  topBar: {
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: Colors.charcoal,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl + Spacing.md,
  },
  heroText: {
    marginBottom: Spacing.xl,
  },
  tagline: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: -0.8,
    lineHeight: 42,
    color: Colors.charcoal,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  features: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.sage,
  },
  featureText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  actions: {
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.olive,
    paddingVertical: 16,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
});
