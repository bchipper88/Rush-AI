import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { RatingStars } from '@/components/RatingStars';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { vibeTags } from '@/content/chapters';
import {
  emptyRoundLog,
  HouseStatus,
  roundMeta,
  RushRound,
  rushRounds,
} from '@/features/houses/houseUtils';
import { track } from '@/lib/analytics';
import { useHouseStore } from '@/state/houseStore';
import { colors, spacing } from '@/theme';

const statusOptions: { key: HouseStatus; label: string }[] = [
  { key: 'invited_back', label: '💌 Invited back' },
  { key: 'interested', label: '⏳ Waiting' },
  { key: 'released', label: '🌙 Released' },
  { key: 'withdrew', label: '🚪 I withdrew' },
];

export default function HouseDetailScreen() {
  const params = useLocalSearchParams<{ id: string; round?: string }>();
  const house = useHouseStore((s) => s.houses.find((h) => h.id === params.id));
  const updateRound = useHouseStore((s) => s.updateRound);
  const setStatus = useHouseStore((s) => s.setStatus);
  const [round, setRound] = useState<RushRound>(
    (params.round as RushRound) && rushRounds.includes(params.round as RushRound)
      ? (params.round as RushRound)
      : 'open_house',
  );

  if (!house) {
    return (
      <Screen safeTop>
        <EmptyState
          emoji="🏛️"
          title="House not found"
          message="It may have been removed from your list."
        />
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const log = house.rounds[round] ?? emptyRoundLog();

  return (
    <Screen safeTop>
      <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
      <AppText variant="title">{house.name}</AppText>
      {house.nickname ? (
        <AppText variant="body" color={colors.muted}>
          {house.nickname}
        </AppText>
      ) : null}

      <SectionHeader title="Round" />
      <SegmentedControl
        scrollable
        value={round}
        onChange={setRound}
        segments={rushRounds.map((r) => ({
          key: r,
          label: `${roundMeta[r].emoji} ${roundMeta[r].short}`,
        }))}
      />

      <SectionHeader
        title={`How did ${roundMeta[round].label} feel?`}
        subtitle="Rate the conversation, not the house's reputation"
      />
      <Card style={styles.card}>
        <RatingStars
          value={log.rating}
          onChange={(rating) => updateRound(house.id, round, { rating, attended: true })}
        />
        <View style={styles.chips}>
          {vibeTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={log.vibes.includes(tag)}
              onPress={() =>
                updateRound(house.id, round, {
                  attended: true,
                  vibes: log.vibes.includes(tag)
                    ? log.vibes.filter((v) => v !== tag)
                    : [...log.vibes, tag],
                })
              }
            />
          ))}
        </View>
        <SearchInput
          placeholder="Who did you talk to? What do you want to remember?"
          value={log.notes}
          onChangeText={(notes) => updateRound(house.id, round, { notes, attended: true })}
          autoCapitalize="sentences"
          multiline
          style={styles.notes}
        />
        <Button
          label={log.attended ? 'I did not attend this round' : 'Mark as attended'}
          variant="ghost"
          onPress={() => updateRound(house.id, round, { attended: !log.attended })}
        />
      </Card>

      <SectionHeader title="Where do you stand?" />
      <View style={styles.chips}>
        {statusOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={opt.label}
            selected={house.status === opt.key}
            onPress={() => {
              setStatus(house.id, opt.key);
              track('house_status_changed', { status: opt.key, round });
              if (opt.key === 'invited_back') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }}
          />
        ))}
      </View>
      {house.status === 'released' ? (
        <Card style={styles.comfort}>
          <AppText variant="small" color={colors.muted}>
            Getting released stings — and it is almost always capacity math, not a verdict on
            you. Popular chapters are required to release the most PNMs early. The houses still
            on your schedule chose you. 💗
          </AppText>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  card: { gap: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  comfort: { marginTop: spacing.md },
});
