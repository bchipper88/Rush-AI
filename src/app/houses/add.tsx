import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeader } from '@/components/SectionHeader';
import { npcChapters } from '@/content/chapters';
import { resolveSchool } from '@/features/checklist/buildChecklist';
import { makeId } from '@/lib/id';
import { useHouseStore } from '@/state/houseStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, spacing } from '@/theme';

export default function AddHousesScreen() {
  const houses = useHouseStore((s) => s.houses);
  const addHouse = useHouseStore((s) => s.addHouse);
  const removeHouse = useHouseStore((s) => s.removeHouse);
  const profile = useProfileStore((s) => s.profile);
  const [query, setQuery] = useState('');
  const [customName, setCustomName] = useState('');

  const school = profile ? resolveSchool(profile) : null;
  const selectedIds = useMemo(() => new Set(houses.map((h) => h.id)), [houses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return npcChapters;
    return npcChapters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nickname.toLowerCase().includes(q) ||
        c.letters.includes(query.trim()),
    );
  }, [query]);

  const toggle = (id: string, name: string, nickname: string) => {
    if (selectedIds.has(id)) {
      removeHouse(id);
    } else {
      addHouse({ id, name, nickname, status: 'interested', rounds: {} });
    }
  };

  return (
    <Screen safeTop>
      <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
      <AppText variant="title">Which houses are on your campus?</AppText>
      <AppText variant="body" color={colors.muted}>
        {school
          ? `${school.shortName} has about ${school.chapterCount} chapters — pick the ones on your schedule.`
          : 'Pick the chapters on your schedule.'}
      </AppText>

      <SearchInput
        placeholder="Search chapters…"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <View style={styles.cards}>
        {filtered.map((chapter) => {
          const selected = selectedIds.has(chapter.id);
          return (
            <Card
              key={chapter.id}
              onPress={() => toggle(chapter.id, chapter.name, chapter.nickname)}
              style={[styles.row, selected ? styles.selected : undefined]}>
              <AppText variant="heading" color={selected ? colors.primary : colors.faint}>
                {chapter.letters}
              </AppText>
              <View style={styles.rowText}>
                <AppText weight="semibold">{chapter.name}</AppText>
                <AppText variant="caption" color={colors.muted}>
                  {chapter.nickname}
                </AppText>
              </View>
              <AppText variant="subheading" color={selected ? colors.primary : colors.faint}>
                {selected ? '✓' : '+'}
              </AppText>
            </Card>
          );
        })}
      </View>

      <SectionHeader
        title="Not listed?"
        subtitle="Local and newer chapters are not part of NPC's 26"
      />
      <Card>
        <SearchInput
          placeholder="Chapter name"
          value={customName}
          onChangeText={setCustomName}
          autoCapitalize="words"
        />
        <Button
          label="Add chapter"
          variant="secondary"
          disabled={!customName.trim()}
          style={styles.addCustom}
          onPress={() => {
            addHouse({
              id: makeId('house'),
              name: customName.trim(),
              custom: true,
              status: 'interested',
              rounds: {},
            });
            setCustomName('');
          }}
        />
      </Card>

      <Button
        label={`Done — ${houses.length} house${houses.length === 1 ? '' : 's'}`}
        onPress={() => router.back()}
        style={styles.done}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  search: { marginTop: spacing.lg },
  cards: { gap: spacing.sm, marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  rowText: { flex: 1, gap: 2 },
  selected: { borderColor: colors.primary, borderWidth: 2 },
  addCustom: { marginTop: spacing.sm },
  done: { marginTop: spacing.xxl },
});
