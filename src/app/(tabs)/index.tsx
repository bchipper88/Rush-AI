import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ActionTile } from '@/components/ActionTile';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { OutcomeCheckIn } from '@/components/OutcomeCheckIn';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatTile } from '@/components/StatTile';
import { StreakFlame } from '@/components/StreakFlame';
import { Timeline } from '@/components/Timeline';
import {
  buildChecklist,
  resolveRushAnchor,
  resolveSchool,
  schoolSeason,
} from '@/features/checklist/buildChecklist';
import { phaseMeta } from '@/features/checklist/phases';
import { buildDailyFocus } from '@/features/daily/dailyFocus';
import { currentRushDay, isRushWeek, roundLabel, rushWeekPlan } from '@/features/daily/rushWeek';
import { activeHouses } from '@/features/houses/houseUtils';
import { dayKey, isStreakMilestone } from '@/features/streak/streakUtils';
import { daysUntil, formatFullDate, formatMonthYear } from '@/lib/dates';
import { useChecklistStore } from '@/state/checklistStore';
import { useHouseStore } from '@/state/houseStore';
import { useProfileStore } from '@/state/profileStore';
import { useStreakStore } from '@/state/streakStore';
import { colors, radii, spacing } from '@/theme';

export default function HomeScreen() {
  const profile = useProfileStore((s) => s.profile);
  const done = useChecklistStore((s) => s.done);
  const houses = useHouseStore((s) => s.houses);
  const streak = useStreakStore((s) => s.streak);

  const school = useMemo(() => (profile ? resolveSchool(profile) : null), [profile]);
  const items = useMemo(
    () => (profile && school ? buildChecklist(profile, school) : []),
    [profile, school],
  );

  const today = dayKey(new Date());
  // The streak itself ticks in the root layout; here we just celebrate it.
  const celebrate = isStreakMilestone(streak.current) && streak.lastActiveDay === today;
  const focus = useMemo(
    () => buildDailyFocus(items, done, today, profile?.name ?? ''),
    [items, done, today, profile?.name],
  );

  if (!profile || !school) return null;

  const anchor = resolveRushAnchor(profile, school);
  const season = profile.rushSeason ?? schoolSeason(school);
  const days = daysUntil(anchor);
  const completed = items.filter((i) => done[i.id]).length;
  const nextTasks = items.filter((i) => !done[i.id]).slice(0, 3);
  const schoolLabel =
    profile.customSchoolName && profile.schoolId === 'custom'
      ? profile.customSchoolName
      : school.shortName;

  const inRushWeek = isRushWeek(days);
  const todayPlan = currentRushDay(days);

  return (
    <View style={styles.root}>
      <Screen padded={false}>
        <LinearGradient
          colors={[colors.blush, colors.primarySoft, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.heroInner}>
            <View style={styles.heroTop}>
              <AppText variant="hero" color={colors.primaryDark} style={styles.greeting}>
                Hi {profile.name} 🎀
              </AppText>
              <StreakFlame days={streak.current} />
            </View>
            <View style={styles.heroChip}>
              <AppText variant="caption" weight="bold" color={colors.primaryDark}>
                {schoolLabel.toUpperCase()} · {season === 'spring' ? 'SPRING' : 'FALL'} RUSH
              </AppText>
            </View>
            <View>
              <AppText style={styles.countNumber} color={colors.white}>
                {days > 0 ? `${days}` : inRushWeek ? '🎀' : '🎉'}
              </AppText>
              <AppText variant="subheading" weight="semibold" color={colors.white}>
                {days > 0
                  ? `days until recruitment · ${
                      profile.targetDate ? formatFullDate(anchor) : formatMonthYear(anchor)
                    }`
                  : inRushWeek
                    ? "It's rush week. You've got this."
                    : 'Recruitment has passed — how did it go?'}
              </AppText>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.body}>
          {/* ---- Rush Week Mode ---- */}
          {inRushWeek && todayPlan ? (
            <>
              <SectionHeader title="Today" subtitle="Your week at a glance" />
              <Card style={styles.todayCard}>
                <AppText variant="heading">{roundLabel(todayPlan.round)}</AppText>
                <AppText variant="small" color={colors.muted}>
                  <AppText variant="small" weight="semibold">
                    Wear:{' '}
                  </AppText>
                  {todayPlan.wear}
                </AppText>
                <AppText variant="small" color={colors.muted}>
                  <AppText variant="small" weight="semibold">
                    Bring:{' '}
                  </AppText>
                  {todayPlan.bring}
                </AppText>
                <View style={styles.reminder}>
                  <AppText variant="small">{todayPlan.reminder}</AppText>
                </View>
                <ActionTile
                  emoji="🏛️"
                  title="Log tonight's parties"
                  subtitle="Rate them while it's fresh"
                  onPress={() => router.push('/(tabs)/houses')}
                />
              </Card>

              <SectionHeader title="This week" />
              <Timeline
                items={rushWeekPlan.map((d) => ({
                  key: `${d.offset}`,
                  title: roundLabel(d.round),
                  subtitle: d.reminder,
                  state:
                    d.offset < -days ? 'done' : d.offset === -days ? 'current' : 'upcoming',
                }))}
              />
            </>
          ) : (
            <>
              {/* ---- Daily focus ---- */}
              <SectionHeader title={focus.greeting} subtitle="One small step keeps the streak" />
              <Card>
                {focus.task ? (
                  <>
                    <AppText variant="caption" weight="semibold" color={colors.primary}>
                      {phaseMeta[focus.task.phase].emoji}{' '}
                      {phaseMeta[focus.task.phase].label.toUpperCase()} · {focus.task.dueLabel}
                    </AppText>
                    <AppText weight="semibold">{focus.task.title}</AppText>
                    <AppText variant="small" color={colors.muted}>
                      {focus.task.detail}
                    </AppText>
                  </>
                ) : (
                  <AppText weight="semibold">Everything on your plan is done ✨</AppText>
                )}
                {focus.tip.text ? (
                  <Card
                    style={styles.tipCard}
                    onPress={() =>
                      focus.tip.slug ? router.push(`/coach/${focus.tip.slug}`) : undefined
                    }>
                    <AppText variant="caption" weight="bold" color={colors.info}>
                      TIP OF THE DAY
                    </AppText>
                    <AppText variant="small">{focus.tip.text}</AppText>
                  </Card>
                ) : null}
              </Card>
            </>
          )}

          <View style={styles.stats}>
            <StatTile
              value={`${completed}/${items.length}`}
              label="plan done"
              emoji="✅"
              tone="success"
            />
            <StatTile value={streak.current} label="day streak" emoji="🔥" tone="primary" />
            <StatTile value={activeHouses(houses).length} label="houses" emoji="🏛️" />
          </View>

          {days <= -8 || profile.outcome ? (
            <>
              <SectionHeader title="Your rush check-in" />
              <OutcomeCheckIn />
            </>
          ) : null}

          {!inRushWeek && nextTasks.length > 0 ? (
            <>
              <SectionHeader title="Up next" subtitle={`${completed} of ${items.length} done`} />
              <View style={styles.tasks}>
                {nextTasks.map((item, i) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(i * 50).duration(260)}>
                    <Card onPress={() => router.push('/(tabs)/checklist')}>
                      <AppText variant="caption" weight="semibold" color={colors.primary}>
                        {phaseMeta[item.phase].emoji} {phaseMeta[item.phase].label} ·{' '}
                        {item.dueLabel}
                      </AppText>
                      <AppText weight="semibold">{item.title}</AppText>
                    </Card>
                  </Animated.View>
                ))}
              </View>
            </>
          ) : null}

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
            emoji="🏛️"
            title="My houses"
            subtitle="Log rounds & build your ranking"
            onPress={() => router.push('/(tabs)/houses')}
          />
          <ActionTile
            emoji="📱"
            title="Social audit"
            subtitle="See your feed like a chapter will"
            onPress={() => router.push('/audit')}
          />
          <ActionTile
            emoji="📖"
            title="Glossary"
            subtitle="Speak fluent rush"
            onPress={() => router.push('/glossary')}
          />
        </ScrollView>
      </Screen>
      {celebrate ? <ConfettiBurst /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
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
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greeting: { flex: 1 },
  heroChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  countNumber: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 64,
    lineHeight: 70,
  },
  body: { paddingHorizontal: spacing.xl },
  todayCard: { gap: spacing.sm },
  reminder: {
    backgroundColor: colors.blush,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  tipCard: { marginTop: spacing.md, gap: spacing.xs, backgroundColor: colors.cream },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  tasks: { gap: spacing.sm },
  tiles: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
