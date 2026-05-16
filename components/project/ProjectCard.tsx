import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Project } from '../../lib/api';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants';
import { PROJECT_STATUSES } from '../../constants';

export function ProjectCard({ project }: { project: Project }) {
  const status = PROJECT_STATUSES.find((s) => s.value === project.status);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.94, transform: [{ scale: 0.99 }] },
      ]}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      {/* Cover image */}
      <View style={styles.imageContainer}>
        {project.coverImageUrl ? (
          <Image
            source={{ uri: project.coverImageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              {project.title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Status badge overlaid on image */}
        {status && (
          <View style={[styles.statusPill, { borderColor: status.color + '60', backgroundColor: Colors.white + 'EE' }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{project.title}</Text>

        {project.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        ) : null}

        {/* Meta row */}
        <View style={styles.meta}>
          {project.difficulty ? (
            <Text style={styles.metaItem}>{project.difficulty}</Text>
          ) : null}
          {project.difficulty && project.estimatedTime ? (
            <Text style={styles.metaDot}>·</Text>
          ) : null}
          {project.estimatedTime ? (
            <Text style={styles.metaItem}>{project.estimatedTime}</Text>
          ) : null}
          {project._count && project._count.steps > 0 ? (
            <>
              {(project.difficulty || project.estimatedTime) && (
                <Text style={styles.metaDot}>·</Text>
              )}
              <Text style={styles.metaItem}>{project._count.steps} steps</Text>
            </>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.oatmeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.linen,
    letterSpacing: -1,
    fontStyle: 'italic',
  },
  statusPill: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    lineHeight: 19,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaItem: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  metaDot: {
    fontSize: 11,
    color: Colors.borderDark,
  },
});
