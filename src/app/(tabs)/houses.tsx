import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { RatingStars } from '@/components/RatingStars';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { StatTile } from '@/components/StatTile';
import {
  activeHouses,
  houseScore,
  releasedHouses,
  roundMeta,
  RushRound,
  rushRounds,
  suggestPrefRanking,
} from '@/features/houses/houseUtils';
import { useHouseStore } from '@/state/houseStore';
import { colors, radii, spacing } from '@/theme';

export default function HousesScreen() {
  const houses = useHouseStore((s) => s.houses);
  const [round, setRound] = useState<RushRound>('open_house');

  const active = useMemo(() => suggestPrefRanking(houses), [houses]);
  const released = useMemo(() => releasedHouses(houses), [houses]);
  const ratedThisRound = houses.filter(
    (h) => h.rounds[round]?.attended && (h.rounds[round]?.rating ?? 0) > 0,
  ).length;

  return (
    <Screen safeTop>
      <AppText variant="title">Your houses</AppText>
      <AppText variant="body" color={colors.muted}>
        Log each party while it&apos;s fresh — by day three they blur together, and these
        notes become your Pref ranking.
      </AppText>

      {houses.length === 0 ? (
        <>
          <EmptyState
            emoji="🏛️"
            title="No houses yet"
            message="Add the chapters on your campus, then rate and take notes after every party."
          />
          <Button label="Add your houses" onPress={() => router.push('/houses/add')} />
        </>
      ) : (
        <>
          <View style={styles.stats}>
            <StatTile value={activeHouses(houses).length} label="in play" emoji="💗" tone="primary" />
            <StatTile value={released.length} label="released" emoji="🌙" />
            <StatTile value={ratedThisRound} label="logged" emoji="✍️" tone="success" />
          </View>

          <SectionHeader title="Round" subtitle="Switch rounds to log or review that day" />
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
            title="Still in play"
            subtitle="Ordered by your own ratings, weighted toward later rounds"
          />
          <View style={styles.cards}>
            {active.map((house, i) => {
              const log = house.rounds[round];
              return (
                <Animated.View key={house.id} entering={FadeInDown.delay(i * 40).duration(260)}>
                  <Card onPress={() => router.push(`/houses/${house.id}?round=${round}`)}>
                    <View style={styles.rowHeader}>
                      <View style={styles.rowText}>
                        <AppText weight="semibold">{house.name}</AppText>
                        <AppText variant="caption" color={colors.muted}>
                          {log?.attended === false
                            ? 'not attended'
                            : log?.rating
                              ? `${roundMeta[round].label} logged`
                              : `tap to log ${roundMeta[round].label}`}
                        </AppText>
                      </View>
                      {houseScore(house) > 0 ? (
                        <View style={styles.scorePill}>
                          <AppText variant="caption" weight="bold" color={colors.primaryDark}>
                            {houseScore(house).toFixed(1)}
                          </AppText>
                        </View>
                      ) : null}
                    </View>
                    <RatingStars value={log?.rating ?? 0} size={20} />
                  </Card>
                </Animated.View>
              );
            })}
          </View>

          {released.length > 0 ? (
            <>
              <SectionHeader
                title="No longer in play"
                subtitle="Almost every PNM gets released somewhere — it is usually capacity math"
              />
              <View style={styles.cards}>
                {released.map((house) => (
                  <Card key={house.id} style={styles.releasedCard}>
                    <AppText weight="semibold" color={colors.muted}>
                      {house.name}
                    </AppText>
                    <AppText variant="caption" color={colors.faint}>
                      {house.status === 'withdrew' ? 'you withdrew' : 'released'}
                    </AppText>
                  </Card>
                ))}
              </View>
            </>
          ) : null}

          <View style={styles.actions}>
            <Button label="🕯️ Build my Pref ranking" onPress={() => router.push('/houses/rank')} />
            <Button
              label="Add or edit houses"
              variant="secondary"
              onPress={() => router.push('/houses/add')}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  cards: { gap: spacing.sm },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowText: { flex: 1, gap: 2 },
  scorePill: {
    backgroundColor: colors.primaryFaint,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  releasedCard: { opacity: 0.7 },
  actions: { gap: spacing.sm, marginTop: spacing.xxl },
});
