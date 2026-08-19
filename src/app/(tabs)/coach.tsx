import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

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

const categoryMeta: Record<ArticleCategory, { label: string; emoji: string }> = {
  basics: { label: 'Rush Basics', emoji: '🌸' },
  strategy: { label: 'Strategy', emoji: '🧠' },
  recs: { label: 'Recs & Materials', emoji: '💌' },
  style: { label: 'Style', emoji: '👗' },
  money: { label: 'Money', emoji: '💵' },
  wellness: { label: 'Wellness', emoji: '💗' },
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
      <AppText variant="body" color={colors.muted}>
        The tactics rush coaches charge thousands for — free, and tuned to your school.
      </AppText>

      <Card onPress={() => router.push('/glossary')} style={styles.glossaryCard}>
        <AppText weight="semibold">📖 Rush glossary</AppText>
        <AppText variant="small" color={colors.muted}>
          Every term from PNM to quota addition, explained.
        </AppText>
      </Card>

      {categoryOrder.map((cat) => {
        const catArticles = visible.filter((a) => a.category === cat);
        if (catArticles.length === 0) return null;
        return (
          <View key={cat}>
            <SectionHeader title={`${categoryMeta[cat].emoji} ${categoryMeta[cat].label}`} />
            <View style={styles.cards}>
              {catArticles.map((article) => (
                <Card
                  key={article.slug}
                  onPress={() => router.push(`/coach/${article.slug}`)}>
                  <View style={styles.cardHeader}>
                    <AppText weight="semibold" style={styles.cardTitle}>
                      {article.title}
                    </AppText>
                    {school && isRelevantForSchool(article, school) ? (
                      <View style={styles.badge}>
                        <AppText variant="caption" weight="bold" color={colors.white}>
                          FOR YOUR SCHOOL
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  <AppText variant="small" color={colors.muted}>
                    {article.teaser}
                  </AppText>
                  <AppText variant="caption" weight="semibold" color={colors.primary}>
                    {article.readingMinutes} min read
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
  glossaryCard: { marginTop: spacing.lg },
  cards: { gap: spacing.sm },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardTitle: { flexShrink: 1 },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
