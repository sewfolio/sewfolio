import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants';

// ─── AppScreen ────────────────────────────────────────────────────────────────
export function AppScreen({
  children,
  style,
  scroll = false,
  padding = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
  padding?: boolean;
}) {
  const content = (
    <View style={[styles.screen, padding && styles.screenPadding, style]}>
      {children}
    </View>
  );
  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.cream }}
        contentContainerStyle={[{ flexGrow: 1 }, padding && styles.screenPadding, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return content;
}

// ─── AppText ──────────────────────────────────────────────────────────────────
type TextVariant = 'serifXL' | 'serifLg' | 'serifMd' | 'displayLg' | 'displayMedium' | 'h1' | 'h2' | 'h3' | 'bodyLarge' | 'body' | 'bodySmall' | 'caption' | 'label' | 'labelSmall';

export function AppText({
  variant = 'body',
  color,
  children,
  style,
  numberOfLines,
  align,
}: {
  variant?: TextVariant;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  align?: 'left' | 'center' | 'right';
}) {
  const base = Typography[variant] ?? Typography.body;
  const isSerif = variant.startsWith('serif');

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        base,
        { color: color ?? Colors.text },
        isSerif && styles.serifFont,
        align && { textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── AppButton ────────────────────────────────────────────────────────────────
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}) {
  const isDisabled = disabled || loading;

  const bgColor = {
    primary: Colors.olive,
    secondary: Colors.oatmeal,
    ghost: 'transparent',
    danger: Colors.error,
    outline: 'transparent',
  }[variant];

  const textColor = {
    primary: Colors.white,
    secondary: Colors.charcoal,
    ghost: Colors.sage,
    danger: Colors.white,
    outline: Colors.charcoal,
  }[variant];

  const paddingV = { sm: 10, md: 15, lg: 19 }[size];
  const fontSize = { sm: 13, md: 14, lg: 15 }[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bgColor, paddingVertical: paddingV },
        variant === 'outline' && styles.btnOutline,
        variant === 'secondary' && styles.btnSecondaryBorder,
        !fullWidth && { alignSelf: 'flex-start', paddingHorizontal: Spacing.lg },
        pressed && !isDisabled && { opacity: 0.78 },
        isDisabled && { opacity: 0.45 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.btnText, { color: textColor, fontSize, letterSpacing: 0.3 }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

// Alias for backwards compatibility
export const Button = AppButton;

// ─── InputField ───────────────────────────────────────────────────────────────
interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function InputField({ label, error, hint, style, ...props }: InputFieldProps) {
  return (
    <View style={styles.inputWrapper}>
      {label && (
        <Text style={styles.inputLabel}>{label.toUpperCase()}</Text>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, style as any]}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
      {hint && !error && <Text style={styles.inputHint}>{hint}</Text>}
    </View>
  );
}

// Alias
export const Input = InputField;

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  style,
  onPress,
  variant = 'default',
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'warm' | 'outline' | 'elevated';
}) {
  const cardStyle = [
    styles.card,
    variant === 'warm' && styles.cardWarm,
    variant === 'outline' && styles.cardOutline,
    variant === 'elevated' && { ...Shadows.md },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...cardStyle, pressed && { opacity: 0.92 }]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={[styles.statValue, accent && { color: Colors.clay }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  progress,
  color,
  height = 3,
  style,
}: {
  progress: number; // 0–1
  color?: string;
  height?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.progressTrack, { height }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            height,
            backgroundColor: color ?? Colors.sage,
          },
        ]}
      />
    </View>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({
  label,
  active = false,
  onPress,
  color,
  size = 'md',
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
  size?: 'sm' | 'md';
}) {
  const activeBg = color ? color + '18' : Colors.olive + '15';
  const activeBorder = color ?? Colors.olive;
  const activeText = color ?? Colors.olive;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        size === 'sm' && styles.chipSm,
        active && { backgroundColor: activeBg, borderColor: activeBorder },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          size === 'sm' && styles.chipTextSm,
          active && { color: activeText, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({
  label,
  color,
  emoji,
}: {
  label: string;
  color: string;
  emoji?: string;
}) {
  return (
    <View style={[styles.badge, { borderColor: color + '50', backgroundColor: color + '12' }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {action && (
        <Pressable onPress={onAction} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  emoji,
  title,
  subtitle,
  action,
  onAction,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      {emoji && <Text style={styles.emptyEmoji}>{emoji}</Text>}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {action && onAction && (
        <AppButton
          title={action}
          onPress={onAction}
          variant="outline"
          fullWidth={false}
          style={{ marginTop: Spacing.lg }}
        />
      )}
    </View>
  );
}

// ─── FloatingActionButton ─────────────────────────────────────────────────────
export function FloatingActionButton({
  onPress,
  icon = '+',
}: {
  onPress: () => void;
  icon?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && { opacity: 0.82, transform: [{ scale: 0.96 }] }]}
    >
      <Text style={styles.fabIcon}>{icon}</Text>
    </Pressable>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}
// ─── StatusChip ───────────────────────────────────────────────────────────────
export function StatusChip({ label, color }: { label: string; color: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: color + '20' }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color, letterSpacing: 0.2 }}>{label}</Text>
    </View>
  );
}
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  screenPadding: {
    paddingHorizontal: Spacing.lg,
  },

  serifFont: {
    fontStyle: 'italic',
  },

  btn: {
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  btnSecondaryBorder: {
    borderWidth: 1,
    borderColor: Colors.oatmeal,
  },
  btnText: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  inputWrapper: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.xs + 2,
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    ...Typography.body,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputErrorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  inputHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.xs,
  },
  cardWarm: {
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderLight,
  },
  cardOutline: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },

  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 80,
  },
  statCardAccent: {
    backgroundColor: Colors.ivory,
    borderColor: Colors.oatmeal,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.charcoal,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  progressTrack: {
    backgroundColor: Colors.oatmeal,
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: Radius.full,
  },

  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSm: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  chipText: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextSm: {
    fontSize: 11,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 5,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.4,
  },
  sectionAction: {
    ...Typography.bodySm,
    color: Colors.sage,
    fontWeight: '500',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.olive,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  fabIcon: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '300',
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
});
