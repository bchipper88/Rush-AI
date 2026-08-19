import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { OnboardingStep } from '@/components/OnboardingStep';
import { SchoolLogo } from '@/components/SchoolLogo';
import { SearchInput } from '@/components/SearchInput';
import { searchDirectory } from '@/content/collegeDirectory';
import { CUSTOM_SCHOOL_ID, schools } from '@/content/schools';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { colors, spacing } from '@/theme';

interface Row {
  key: string;
  name: string;
  domain?: string;
  /** curated school id, or CUSTOM_SCHOOL_ID for directory/custom entries */
  schoolId: string;
  isCustomEntry?: boolean;
}

export default function SchoolStep() {
  const [query, setQuery] = useState('');
  const schoolId = useOnboardingDraft((s) => s.schoolId);
  const customSchoolName = useOnboardingDraft((s) => s.customSchoolName);
  const customSchoolDomain = useOnboardingDraft((s) => s.customSchoolDomain);
  const setSchool = useOnboardingDraft((s) => s.setSchool);

  const rows = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    const curated = schools
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q),
      )
      .map((s) => ({ key: s.id, name: s.name, domain: s.domain, schoolId: s.id }));
    const directory = searchDirectory(query).map((c) => ({
      key: `dir:${c.domain}`,
      name: c.name,
      domain: c.domain,
      schoolId: CUSTOM_SCHOOL_ID,
    }));
    return [...curated, ...directory];
  }, [query]);

  const isSelected = (row: Row) =>
    row.schoolId === CUSTOM_SCHOOL_ID
      ? schoolId === CUSTOM_SCHOOL_ID && customSchoolName === row.name
      : schoolId === row.schoolId;

  const selectedFreeText =
    schoolId === CUSTOM_SCHOOL_ID &&
    customSchoolDomain === '' &&
    !rows.some((r) => r.schoolId === CUSTOM_SCHOOL_ID && r.name === customSchoolName);

  return (
    <OnboardingStep
      step={2}
      title="Where are you rushing?"
      subtitle="Search any U.S. college — we'll tailor your plan to your campus."
      ctaDisabled={!schoolId || (schoolId === CUSTOM_SCHOOL_ID && customSchoolName.trim() === '')}
      onNext={() => router.push('/onboarding/priorities')}>
      <SearchInput placeholder="Search schools…" value={query} onChangeText={setQuery} />
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const selected = isSelected(item);
          return (
            <Card
              onPress={() =>
                item.schoolId === CUSTOM_SCHOOL_ID
                  ? setSchool(CUSTOM_SCHOOL_ID, item.name, item.domain)
                  : setSchool(item.schoolId)
              }
              style={[styles.rowCard, selected ? styles.selectedCard : undefined]}>
              <SchoolLogo domain={item.domain} />
              <AppText weight="semibold" style={styles.rowName}>
                {item.name}
              </AppText>
            </Card>
          );
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Card
              onPress={() => setSchool(CUSTOM_SCHOOL_ID, customSchoolDomain ? '' : customSchoolName)}
              style={selectedFreeText ? styles.selectedCard : undefined}>
              <AppText weight="semibold">My school isn&apos;t listed</AppText>
              {selectedFreeText ? (
                <SearchInput
                  placeholder="Type your school's name"
                  value={customSchoolName}
                  onChangeText={(t) => setSchool(CUSTOM_SCHOOL_ID, t)}
                  autoCapitalize="words"
                  style={styles.customInput}
                />
              ) : null}
            </Card>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="small" color={colors.muted} center style={styles.empty}>
            No matches — try fewer letters, or add your school below.
          </AppText>
        }
      />
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.md },
  listContent: { gap: spacing.sm, paddingBottom: spacing.xl },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowName: { flex: 1 },
  selectedCard: { borderColor: colors.primary, borderWidth: 2 },
  footer: { marginTop: spacing.sm },
  customInput: { marginTop: spacing.sm },
  empty: { paddingVertical: spacing.xl },
});
