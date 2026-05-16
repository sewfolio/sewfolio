import { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { projectsApi } from '../../../lib/api';
import { InputField, AppButton, Divider } from '../../../components/ui';
import { Colors, Typography, Spacing, Radius } from '../../../constants';
import { PROJECT_STATUSES, SOURCE_TYPES } from '../../../constants';

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

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id!),
    enabled: !!id,
  });

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', description: '', difficulty: '',
      estimatedTime: '', sourceUrl: '', status: 'SAVED', sourceType: 'MANUAL',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title ?? '',
        description: project.description ?? '',
        difficulty: project.difficulty ?? '',
        estimatedTime: project.estimatedTime ?? '',
        sourceUrl: project.sourceUrl ?? '',
        status: project.status ?? 'SAVED',
        sourceType: project.sourceType ?? 'MANUAL',
      });
    }
  }, [project]);

  const selectedStatus = watch('status');
  const selectedSource = watch('sourceType');

  const { mutate: update, isPending } = useMutation({
    mutationFn: (data: FormData) => projectsApi.update(id!, data as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['project', id] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      Toast.show({ type: 'success', text1: 'Project updated' });
      router.back();
    },
    onError: (e: any) => {
      Toast.show({ type: 'error', text1: 'Update failed', text2: e.message });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.sage} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Project</Text>
          <AppButton
            title="Save"
            size="sm"
            onPress={handleSubmit((d) => update(d))}
            loading={isPending}
            fullWidth={false}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                placeholder="A brief description..."
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
                  <InputField label="Difficulty" placeholder="Beginner" value={value} onChangeText={onChange} onBlur={onBlur} />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="estimatedTime"
                render={({ field: { onChange, value, onBlur } }) => (
                  <InputField label="Est. Time" placeholder="2-3 hours" value={value} onChangeText={onChange} onBlur={onBlur} />
                )}
              />
            </View>
          </View>

          <Divider />

          <Text style={styles.pickerLabel}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {PROJECT_STATUSES.map((s) => {
              const active = selectedStatus === s.value;
              return (
                <Pressable
                  key={s.value}
                  style={[styles.chip, active && { backgroundColor: s.color + '15', borderColor: s.color + '60' }]}
                  onPress={() => setValue('status', s.value)}
                >
                  <View style={[styles.chipDot, { backgroundColor: active ? s.color : Colors.borderDark }]} />
                  <Text style={[styles.chipLabel, active && { color: s.color, fontWeight: '600' }]}>{s.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Divider />

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
                  <Text style={[styles.chipLabel, active && { color: Colors.olive, fontWeight: '600' }]}>{s.label}</Text>
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
                label="Source URL"
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
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
  pickerLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1.2, marginBottom: Spacing.sm },
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
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipLabel: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  sourceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  sourceChipActive: { borderColor: Colors.olive + '60', backgroundColor: Colors.olive + '10' },
});