import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { projectsApi } from '../../lib/api';
import { InputField, AppButton, Divider } from '../../components/ui';
import { Colors, Typography, Spacing, Radius } from '../../constants';
import { PROJECT_STATUSES, SOURCE_TYPES } from '../../constants';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedTime: z.string().optional(),
  sourceUrl: z.string().optional(),
  status: z.string().default('SAVED'),
  sourceType: z.string().default('MANUAL'),
});
type FormData = z.infer<typeof schema>;

export default function NewProjectScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const qc = useQueryClient();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: '',
      estimatedTime: '',
      sourceUrl: '',
      status: 'SAVED',
      sourceType: mode === 'url' ? 'YOUTUBE' : 'MANUAL',
    },
  });

  const selectedStatus = watch('status');
  const selectedSource = watch('sourceType');

  const { mutate: create, isPending } = useMutation({
    mutationFn: (data: FormData) => projectsApi.create(data as any),
    onSuccess: (project) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      Toast.show({ type: 'success', text1: 'Project saved' });
      router.replace(`/project/${project.id}`);
    },
    onError: (e: any) => {
      Toast.show({ type: 'error', text1: 'Could not save project', text2: e.message });
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>New Project</Text>
          <AppButton
            title="Save"
            size="sm"
            onPress={handleSubmit((d) => create(d))}
            loading={isPending}
            fullWidth={false}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Basic info */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Title *"
                placeholder="e.g. Linen Tote Bag"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Description"
                placeholder="A brief description of the project..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' } as any}
              />
            )}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="difficulty"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField
                    label="Difficulty"
                    placeholder="Beginner"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="estimatedTime"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField
                    label="Est. Time"
                    placeholder="2–3 hours"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>
          </View>

          <Divider />

          {/* Status */}
          <Text style={styles.pickerLabel}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {PROJECT_STATUSES.map((s) => {
              const active = selectedStatus === s.value;
              return (
                <Pressable
                  key={s.value}
                  style={[
                    styles.chip,
                    active && { backgroundColor: s.color + '15', borderColor: s.color + '60' },
                  ]}
                  onPress={() => setValue('status', s.value)}
                >
                  <View style={[styles.chipDot, { backgroundColor: active ? s.color : Colors.borderDark }]} />
                  <Text style={[styles.chipLabel, active && { color: s.color, fontWeight: '600' }]}>
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Divider />

          {/* Source type */}
          <Text style={styles.pickerLabel}>SOURCE TYPE</Text>
          <View style={styles.sourceGrid}>
            {SOURCE_TYPES.map((s) => {
              const active = selectedSource === s.value;
              return (
                <Pressable
                  key={s.value}
                  style={[styles.sourceChip, active && styles.sourceChipActive]}
                  onPress={() => setValue('sourceType', s.value)}
                >
                  <Text style={[styles.chipLabel, active && { color: Colors.olive, fontWeight: '600' }]}>
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Divider />

          <Controller
            control={control}
            name="sourceUrl"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Source URL (optional)"
                placeholder="https://..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="url"
                autoCapitalize="none"
              />
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  cancelBtn: { paddingVertical: 4 },
  cancelText: { ...Typography.body, color: Colors.textMuted },
  headerTitle: { ...Typography.h3, color: Colors.charcoal },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', gap: Spacing.md },
  pickerLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  chipRow: { marginBottom: Spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  chipLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sourceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  sourceChipActive: {
    borderColor: Colors.olive + '60',
    backgroundColor: Colors.olive + '10',
  },
});
