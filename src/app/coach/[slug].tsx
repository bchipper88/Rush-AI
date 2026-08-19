import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { getArticleBySlug } from '@/content/articles';
import { colors, radii, spacing } from '@/theme';
import type { ArticleBlock } from '@/types';

const calloutColors = {
  tip: { bg: '#ECFDF5', border: colors.success, label: 'TIP' },
  warning: { bg: '#FFFBEB', border: colors.warning, label: 'HEADS UP' },
  info: { bg: '#F5F3FF', border: colors.info, label: 'GOOD TO KNOW' },
} as const;

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <AppText variant="heading" style={styles.blockHeading}>
          {block.text}
        </AppText>
      );
    case 'paragraph':
      return <AppText variant="body">{block.text}</AppText>;
    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, i) => (
            <View key={i} style={styles.listRow}>
              <AppText variant="body" weight="bold" color={colors.primary}>
                {block.ordered ? `${i + 1}.` : '•'}
              </AppText>
              <AppText variant="body" style={styles.listText}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
      );
    case 'callout': {
      const c = calloutColors[block.tone];
      return (
        <View style={[styles.callout, { backgroundColor: c.bg, borderColor: c.border }]}>
          <AppText variant="caption" weight="bold" color={c.border}>
            {c.label}
          </AppText>
          <AppText variant="body">{block.text}</AppText>
        </View>
      );
    }
    case 'doDont':
      return (
        <View style={styles.doDont}>
          <Card style={styles.doCard}>
            <AppText variant="small" weight="bold" color={colors.success}>
              DO
            </AppText>
            {block.dos.map((d, i) => (
              <AppText key={i} variant="small">
                ✓ {d}
              </AppText>
            ))}
          </Card>
          <Card style={styles.dontCard}>
            <AppText variant="small" weight="bold" color={colors.danger}>
              DON&apos;T
            </AppText>
            {block.donts.map((d, i) => (
              <AppText key={i} variant="small">
                ✗ {d}
              </AppText>
            ))}
          </Card>
        </View>
      );
  }
}

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Screen safeTop>
        <EmptyState
          emoji="🔍"
          title="Article not found"
          message="This guide may have moved. Head back to the Coach tab."
        />
        <Button label="Back to Coach" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen safeTop>
      <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
      <AppText variant="title">{article.title}</AppText>
      <AppText variant="caption" weight="semibold" color={colors.primary}>
        {article.readingMinutes} MIN READ
      </AppText>
      <View style={styles.blocks}>
        {article.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  blocks: { gap: spacing.lg, marginTop: spacing.lg },
  blockHeading: { marginTop: spacing.sm },
  list: { gap: spacing.sm },
  listRow: { flexDirection: 'row', gap: spacing.sm },
  listText: { flex: 1 },
  callout: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  doDont: { gap: spacing.sm },
  doCard: { gap: spacing.xs, borderColor: colors.success },
  dontCard: { gap: spacing.xs, borderColor: colors.danger },
});
