import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import {
  buildChecklist,
  resolveRushAnchor,
  resolveSchool,
  schoolSeason,
} from '@/features/checklist/buildChecklist';
import { phaseMeta } from '@/features/checklist/phases';
import { daysUntil, formatFullDate, formatMonthYear } from '@/lib/dates';
import { useChecklistStore } from '@/state/checklistStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, radii, spacing } from '@/theme';

export default function HomeScreen() {
  const profile = useProfileStore((s) => s.profile);
  const done = useChecklistStore((s) => s.done);

  const school = useMemo(
    () => (profile ? resolveSchool(profile) : null),
    [profile],
  );
  const items = useMemo(
    () => (profile && school ? buildChecklist(profile, school) : []),
    [profile, school],
  );

  if (!profile || !school) return null;

  const anchor = resolveRushAnchor(profile, school);
  const season = profile.rushSeason ?? schoolSeason(school);
  const days = daysUntil(anchor);
  const nextTasks = items.filter((i) => !done[i.id]).slice(0, 3);
  const completed = items.filter((i) => done[i.id]).length;
  const schoolLabel =
    profile.customSchoolName && profile.schoolId === 'custom'
      ? profile.customSchoolName
      : school.shortName;

  return (
    <Screen safeTop>
      <AppText variant="title">Hi {profile.name} 🎀</AppText>

      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <AppText variant="small" weight="semibold" color={colors.blush}>
          {schoolLabel} · {season === 'spring' ? 'Spring' : 'Fall'} rush
        </AppText>
        <AppText variant="hero" color={colors.white}>
          {days > 0 ? `${days} days` : 'Rush is here!'}
        </AppText>
        <AppText variant="small" color={colors.blush}>
          {days > 0
            ? `until recruitment · ${
                profile.targetDate ? formatFullDate(anchor) : formatMonthYear(anchor)
              }`
            : 'You are ready. Deep breath — go be yourself.'}
        </AppText>
      </LinearGradient>

      <SectionHeader
        title="Up next"
        subtitle={`${completed} of ${items.length} tasks done`}
      />
      {nextTasks.length === 0 ? (
        <Card>
          <AppText weight="semibold">All caught up! ✨</AppText>
          <AppText variant="small" color={colors.muted}>
            Every task is checked off. Browse the Coach tab or run a social audit.
          </AppText>
        </Card>
      ) : (
        <View style={styles.tasks}>
          {nextTasks.map((item) => (
            <Card key={item.id} onPress={() => router.push('/(tabs)/checklist')}>
              <AppText variant="caption" weight="semibold" color={colors.primary}>
                {phaseMeta[item.phase].emoji} {phaseMeta[item.phase].label} · {item.dueLabel}
              </AppText>
              <AppText weight="semibold">{item.title}</AppText>
            </Card>
          ))}
        </View>
      )}

      <SectionHeader title="Your toolkit" />
      <View style={styles.tasks}>
        <Card onPress={() => router.push('/audit/new')}>
          <AppText weight="semibold">📱 Run a social media audit</AppText>
          <AppText variant="small" color={colors.muted}>
            Chapters look at your profiles during pre-screening. See yours the way they will.
          </AppText>
        </Card>
        <Card onPress={() => router.push('/(tabs)/coach')}>
          <AppText weight="semibold">🎀 Coach tips</AppText>
          <AppText variant="small" color={colors.muted}>
            Rounds, conversations, the Five B&apos;s, and bid-matching strategy — all in one place.
          </AppText>
        </Card>
        <Card onPress={() => router.push('/glossary')}>
          <AppText weight="semibold">📖 Rush glossary</AppText>
          <AppText variant="small" color={colors.muted}>
            PNM? Rho Gamma? MRABA? Speak fluent rush before you arrive.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  tasks: { gap: spacing.sm },
});
