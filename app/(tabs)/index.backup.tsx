import { View, Text, StyleSheet, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { projectsApi, usersApi, Project } from '../../lib/api';
import { Colors, Spacing, Radius, Shadows } from '../../constants';
import { PROJECT_STATUSES } from '../../constants';
import { StatCard, SectionHeader, StatusChip, ProgressBar, EmptyState } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const PROGRESS: Record<string, number> = {
  SAVED: 0, PLANNED: 0.15, IN_PROGRESS: 0.5, FINISHED: 1, ARCHIVED: 1,
};

function ProjectRow({ project }: { project: Project }) {
  const status = PROJECT_STATUSES.find((s) => s.value === project.status);
  const progress = PROGRESS[project.status] ?? 0;
  return (
    <Pressable
      style={({ pressed }) => [styles.projectRow, pressed && { opacity: 0.88 }]}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <View style={styles.thumb}>
        {project.coverImageUrl ? (
          <Image source={{ uri: project.coverImageUrl }} style={styles.thumbImg} resizeMode="cover" />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbLetter}>{project.title.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.projectRowContent}>
        <Text style={styles.projectRowTitle} numberOfLines={1}>{project.title}</Text>
        {status && <StatusChip label={status.label} color={status.color} />}
        <View style={styles.projectRowProgress}>
          <ProgressBar progress={progress} color={status?.color} height={4} />
          <Text style={styles.projectRowPct}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={16} color={Colors.textMuted} />
    </Pressable>
  );
}

function RecentThumb({ project }: { project: Project }) {
  return (
    <Pressable style={styles.recentThumb} onPress={() => router.push(`/project/${project.id}`)}>
      {project.coverImageUrl ? (
        <Image source={{ uri: project.coverImageUrl }} style={styles.recentThumbImg} resizeMode="cover" />
      ) : (
        <View style={styles.recentThumbPlaceholder}>
          <Text style={styles.recentThumbLetter}>{project.title.charAt(0)}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function HomeTab() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: allProjects, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectsApi.list({ limit: 50 }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: usersApi.getStats,
  });

  const projects = allProjects?.items ?? [];
  const inProgress = projects.filter((p) => p.status === 'IN_PROGRESS');
  const recent = projects.filter((p) => p.status === 'SAVED').slice(0, 4);
  const finished = projects.filter((p) => p.status === 'FINISHED').length;
  const wips = projects.filter((p) => p.status === 'IN_PROGRESS').length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.sage} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {firstName}! ✦</Text>
            <Text style={styles.dashTitle}>My Dashboard</Text>
          </View>
          <Pressable style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textBody} />
          </Pressable>
        </View>

        <View style={styles.statRow}>
          <StatCard value={stats?.totalProjects ?? projects.length} label="Projects" bg={Colors.statBg1} />
          <StatCard value={wips} label="WIPs" bg={Colors.statBg2} />
          <StatCard value={finished} label="Finished" bg={Colors.statBg3} />
          <StatCard value={recent.length} label="Saved" bg={Colors.statBg4} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="In Progress" action="See all" onAction={() => router.push('/(tabs)/explore')} />
          {inProgress.length === 0 ? (
            <View style={styles.emptyInline}>
              <Text style={styles.emptyInlineText}>No projects in progress yet</Text>
            </View>
          ) : (
            <View style={styles.projectList}>
              {inProgress.slice(0, 3).map((p) => <ProjectRow key={p.id} project={p} />)}
            </View>
          )}
        </View>

        {recent.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recently Saved" action="See all" onAction={() => router.push('/(tabs)/explore')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recent.map((p) => <RecentThumb key={p.id} project={p} />)}
            </ScrollView>
          </View>
        )}

        {projects.length === 0 && !isLoading && (
          <EmptyState
            emoji="🧵"
            title="No projects yet"
            subtitle="Save your first sewing project to get started"
            action="+ New Project"
            onAction={() => router.push('/project/new')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  greeting: { fontSize: 13, color: Colors.textMuted, fontWeight: '400', marginBottom: 2 },
  dashTitle: { fontSize: 26, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  bellBtn: { padding: Spacing.xs, marginTop: 4 },
  statRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  projectList: { gap: Spacing.sm },
  projectRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, gap: Spacing.md, ...Shadows.xs,
  },
  thumb: { width: 64, height: 64, borderRadius: Radius.md, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.bgMuted, justifyContent: 'center', alignItems: 'center' },
  thumbLetter: { fontSize: 22, fontWeight: '300', color: Colors.textMuted, fontStyle: 'italic' },
  projectRowContent: { flex: 1, gap: 5 },
  projectRowTitle: { fontSize: 15, fontWeight: '600', color: Colors.textDark, letterSpacing: -0.1 },
  projectRowProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  projectRowPct: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', minWidth: 28 },
  recentThumb: { width: 80, height: 80, borderRadius: Radius.md, marginRight: Spacing.sm, overflow: 'hidden', ...Shadows.xs },
  recentThumbImg: { width: '100%', height: '100%' },
  recentThumbPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.bgMuted, justifyContent: 'center', alignItems: 'center' },
  recentThumbLetter: { fontSize: 24, fontWeight: '300', color: Colors.textMuted, fontStyle: 'italic' },
  emptyInline: { backgroundColor: Colors.bgWarm, borderRadius: Radius.md, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyInlineText: { fontSize: 13, color: Colors.textMuted },
});