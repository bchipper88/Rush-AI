import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ActionTile } from '@/components/ActionTile';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { OutcomeCheckIn } from '@/components/OutcomeCheckIn';
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
    <Screen padded={false}>
      {/* Headspace-style Today Hero: tall aurora gradient with greeting inside */}
      <LinearGradient
        colors={[colors.blush, colors.primarySoft, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.heroInner}>
          <AppText variant="hero" color={colors.primaryDark}>
            Hi {profile.name} 🎀
          </AppText>
          <View style={styles.heroChip}>
            <AppText variant="caption" weight="bold" color={colors.primaryDark}>
              {schoolLabel.toUpperCase()} · {season === 'spring' ? 'SPRING' : 'FALL'} RUSH
            </AppText>
          </View>
          <View style={styles.countdown}>
            <AppText style={styles.countNumber} color={colors.white}>
              {days > 0 ? `${days}` : '🎉'}
            </AppText>
            <AppText variant="subheading" weight="semibold" color={colors.white}>
              {days > 0
                ? `days until recruitment · ${
                    profile.targetDate ? formatFullDate(anchor) : formatMonthYear(anchor)
                  }`
                : 'Rush is here — deep breath, go be yourself.'}
            </AppText>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.body}>
        {days <= -8 || profile.outcome ? (
          <>
            <SectionHeader title="Your rush check-in" />
            <OutcomeCheckIn />
          </>
        ) : null}
        <SectionHeader
          title="Up next"
          subtitle={`${completed} of ${items.length} tasks done`}
        />
        {nextTasks.length === 0 ? (
          <Card>
            <AppText weight="semibold">All caught up! ✨</AppText>
            <AppText variant="small" color={colors.muted}>
              Every task is checked off. Ask your coach what else you can polish.
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
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tiles}>
        <ActionTile
          emoji="💬"
          title="Ask your coach"
          subtitle="What should I work on next?"
          onPress={() => router.push('/coach/chat')}
        />
        <ActionTile
          emoji="🎭"
          title="Practice talking"
          subtitle="Rehearse a round, get scored"
          onPress={() => router.push('/coach/practice')}
        />
        <ActionTile
          emoji="📱"
          title="Social audit"
          subtitle="See your feed like a chapter will"
          onPress={() => router.push('/audit/new')}
        />
        <ActionTile
          emoji="🎀"
          title="Coach guides"
          subtitle="Rounds, recs, outfits & more"
          onPress={() => router.push('/(tabs)/coach')}
        />
        <ActionTile
          emoji="📖"
          title="Glossary"
          subtitle="Speak fluent rush"
          onPress={() => router.push('/glossary')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 260,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    justifyContent: 'flex-end',
  },
  heroInner: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl + spacing.xl,
    gap: spacing.md,
  },
  heroChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  countdown: { gap: 0 },
  countNumber: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 64,
    lineHeight: 70,
  },
  body: { paddingHorizontal: spacing.xl },
  tasks: { gap: spacing.sm },
  tiles: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
