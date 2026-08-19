import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { articles } from '@/content/articles';
import { resolveSchool } from '@/features/checklist/buildChecklist';
import { isApplicable, isRelevantForSchool } from '@/features/coach/articleFilters';
import { useProfileStore } from '@/state/profileStore';
import { colors, radii, spacing } from '@/theme';
import type { ArticleCategory } from '@/types';

const categoryMeta: Record<
  ArticleCategory,
  { label: string; emoji: string; pill: string; pillText: string }
> = {
  basics: { label: 'Rush Basics', emoji: '🌸', pill: '#FCE7F0', pillText: '#BE185D' },
  strategy: { label: 'Strategy', emoji: '🧠', pill: '#EDE6F7', pillText: '#7C5FB8' },
  recs: { label: 'Recs & Materials', emoji: '💌', pill: '#FFEFE0', pillText: '#C07A2E' },
  style: { label: 'Style', emoji: '👗', pill: '#FFE4EC', pillText: '#D14D7E' },
  money: { label: 'Money', emoji: '💵', pill: '#E3F5EC', pillText: '#2E7D5B' },
  wellness: { label: 'Wellness', emoji: '💗', pill: '#FDE8E8', pillText: '#C2504F' },
};

const categoryOrder: ArticleCategory[] = [
  'basics',
  'strategy',
  'recs',
  'style',
  'money',
  'wellness',
];

export default function CoachScreen() {
  const profile = useProfileStore((s) => s.profile);
  const school = useMemo(
    () => (profile ? resolveSchool(profile) : null),
    [profile],
  );

  const visible = useMemo(
    () => (school ? articles.filter((a) => isApplicable(a, school)) : articles),
    [school],
  );

  return (
    <Screen safeTop>
      <AppText variant="title">Coach</AppText>

      {/* Chatbot entry hero */}
      <Pressable onPress={() => router.push('/coach/chat')}>
        {({ pressed }) => (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.chatHero, pressed && styles.pressed]}>
            <AppText style={styles.chatEmoji}>💬</AppText>
            <View style={styles.chatHeroText}>
              <AppText variant="subheading" weight="bold" color={colors.white}>
                Ask your coach anything
              </AppText>
              <AppText variant="small" color={colors.blush}>
                She knows your plan — try “what should I work on next?”
              </AppText>
            </View>
            <AppText variant="heading" color={colors.white}>
              ›
            </AppText>
          </LinearGradient>
        )}
      </Pressable>

      <Card onPress={() => router.push('/glossary')} style={styles.glossaryCard}>
        <AppText weight="semibold">📖 Rush glossary</AppText>
        <AppText variant="small" color={colors.muted}>
          Every term from PNM to quota addition, explained.
        </AppText>
      </Card>

      {categoryOrder.map((cat) => {
        const catArticles = visible.filter((a) => a.category === cat);
        if (catArticles.length === 0) return null;
        const meta = categoryMeta[cat];
        return (
          <View key={cat}>
            <SectionHeader title={`${meta.emoji} ${meta.label}`} />
            <View style={styles.cards}>
              {catArticles.map((article) => (
                <Card
                  key={article.slug}
                  onPress={() => router.push(`/coach/${article.slug}`)}>
                  <View style={styles.pillRow}>
                    <View style={[styles.pill, { backgroundColor: meta.pill }]}>
                      <AppText
                        variant="caption"
                        weight="semibold"
                        color={meta.pillText}
                        style={styles.pillText}>
                        {meta.label.toUpperCase()}
                      </AppText>
                    </View>
                    {school && isRelevantForSchool(article, school) ? (
                      <View style={[styles.pill, styles.schoolPill]}>
                        <AppText variant="caption" weight="bold" color={colors.white}>
                          FOR YOUR SCHOOL
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  <AppText weight="semibold">{article.title}</AppText>
                  <AppText variant="small" color={colors.muted}>
                    {article.teaser}
                  </AppText>
                  <AppText variant="caption" weight="semibold" color={colors.faint}>
                    {article.readingMinutes} MIN READ
                  </AppText>
                </Card>
              ))}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.xl - 4,
    marginTop: spacing.lg,
  },
  pressed: { opacity: 0.9 },
  chatEmoji: { fontSize: 32, lineHeight: 38 },
  chatHeroText: { flex: 1, gap: 2 },
  glossaryCard: { marginTop: spacing.md },
  cards: { gap: spacing.sm },
  pillRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  pill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  pillText: { letterSpacing: 0.2 },
  schoolPill: { backgroundColor: colors.primary },
});
