import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { OnboardingStep } from '@/components/OnboardingStep';
import { SearchInput } from '@/components/SearchInput';
import { CUSTOM_SCHOOL_ID, schools } from '@/content/schools';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { colors, spacing } from '@/theme';

export default function SchoolStep() {
  const [query, setQuery] = useState('');
  const schoolId = useOnboardingDraft((s) => s.schoolId);
  const customSchoolName = useOnboardingDraft((s) => s.customSchoolName);
  const setSchool = useOnboardingDraft((s) => s.setSchool);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter(
      (s) => s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q),
    );
  }, [query]);

  const selectedCustom = schoolId === CUSTOM_SCHOOL_ID;

  return (
    <OnboardingStep
      step={1}
      title="Where are you rushing?"
      subtitle="Your school decides your timeline, rec-letter needs, and budget guidance."
      ctaDisabled={!schoolId || (selectedCustom && customSchoolName.trim() === '')}
      onNext={() => router.push('/onboarding/priorities')}>
      <SearchInput placeholder="Search schools…" value={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const selected = schoolId === item.id;
          return (
            <Card
              onPress={() => setSchool(item.id)}
              style={selected ? styles.selectedCard : undefined}>
              <AppText weight="semibold">{item.name}</AppText>
              <AppText variant="caption" color={colors.muted}>
                {item.style === 'deferred_spring' ? 'Spring rush' : 'Fall rush'} ·{' '}
                {item.chapterCount} chapters ·{' '}
                {item.recs === 'not_used' ? 'no recs needed' : 'rec letters matter'} ·{' '}
                {'$'.repeat(item.costTier)}
              </AppText>
            </Card>
          );
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Card
              onPress={() => setSchool(CUSTOM_SCHOOL_ID, customSchoolName || ' ')}
              style={selectedCustom ? styles.selectedCard : undefined}>
              <AppText weight="semibold">My school isn&apos;t listed</AppText>
              {selectedCustom ? (
                <SearchInput
                  placeholder="Type your school's name"
                  value={customSchoolName.trim()}
                  onChangeText={(t) => setSchool(CUSTOM_SCHOOL_ID, t)}
                  autoCapitalize="words"
                />
              ) : null}
            </Card>
          </View>
        }
      />
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.md },
  listContent: { gap: spacing.sm, paddingBottom: spacing.xl },
  selectedCard: { borderColor: colors.primary, borderWidth: 2 },
  footer: { marginTop: spacing.sm },
});
