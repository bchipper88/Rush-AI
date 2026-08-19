import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { glossary } from '@/content/glossary';
import { colors, spacing } from '@/theme';

export default function GlossaryScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.aka?.some((a) => a.toLowerCase().includes(q)) ||
        t.definition.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Rush glossary 📖</AppText>
        <SearchInput placeholder="Search terms…" value={query} onChangeText={setQuery} />
      </View>
      {filtered.length === 0 ? (
        <EmptyState
          emoji="🤔"
          title="No matches"
          message="Try a different word — or ask your Rho Gamma, that's what she's there for."
        />
      ) : (
        <View style={styles.cards}>
          {filtered.map((t) => (
            <Card key={t.term}>
              <AppText weight="semibold">{t.term}</AppText>
              {t.aka ? (
                <AppText variant="caption" weight="semibold" color={colors.primary}>
                  also: {t.aka.join(', ')}
                </AppText>
              ) : null}
              <AppText variant="small" color={colors.muted}>
                {t.definition}
              </AppText>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, paddingTop: spacing.xl, marginBottom: spacing.lg },
  cards: { gap: spacing.sm },
});
