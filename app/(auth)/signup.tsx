import { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { InputField, AppButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const signup = useAuthStore((s) => s.signup);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Could not create account', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.navBack}>← Back</Text>
          </Pressable>
          <Text style={styles.navWordmark}>Sewfolio</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.heading}>Create your{'\n'}workspace.</Text>
          <Text style={styles.subheading}>
            A place to save, track, and finish everything you make.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Your Name"
                placeholder="Jane Doe"
                autoCapitalize="words"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Password"
                placeholder="At least 8 characters"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                hint="Minimum 8 characters"
              />
            )}
          />

          <View style={{ marginTop: Spacing.sm }}>
            <AppButton
              title="Create account"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.xxl,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  navBack: { ...Typography.body, color: Colors.textMuted },
  navWordmark: {
    fontSize: 15,
    fontWeight: '500',
    fontStyle: 'italic',
    color: Colors.charcoal,
    letterSpacing: 0.3,
  },
  header: { marginBottom: Spacing.xl },
  heading: {
    fontSize: 32,
    fontWeight: '300',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    lineHeight: 42,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  subheading: { ...Typography.body, color: Colors.textMuted, lineHeight: 22 },
  form: { marginBottom: Spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { ...Typography.body, color: Colors.textMuted },
  footerLink: { ...Typography.body, color: Colors.sage, fontWeight: '500' },
});
