import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import {
  attendedRounds,
  houseScore,
  maximizeOptionsWarning,
  suggestPrefRanking,
  TrackedHouse,
} from '@/features/houses/houseUtils';
import { track } from '@/lib/analytics';
import { useHouseStore } from '@/state/houseStore';
import { colors, radii, spacing } from '@/theme';

export default function PrefRankScreen() {
  const houses = useHouseStore((s) => s.houses);
  const setPrefOrder = useHouseStore((s) => s.setPrefOrder);

  const suggested = useMemo(() => suggestPrefRanking(houses), [houses]);
  const [order, setOrder] = useState<TrackedHouse[]>(suggested);
  const [dropped, setDropped] = useState<string[]>([]);

  const attendedPref = houses.filter((h) => h.rounds.preference?.attended).length;
  const listedCount = order.filter((h) => !dropped.includes(h.id)).length;
  const warning = maximizeOptionsWarning(
    attendedPref || order.length,
    listedCount,
  );

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  if (houses.length === 0) {
    return (
      <Screen safeTop>
        <EmptyState
          emoji="🕯️"
          title="Nothing to rank yet"
          message="Add your houses and log a few rounds, then come back — this builds your MRABA order from your own notes."
        />
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const warnColor =
    warning.severity === 'danger'
      ? colors.danger
      : warning.severity === 'caution'
        ? colors.warning
        : colors.success;

  return (
    <Screen safeTop>
      <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
      <AppText variant="title">Your Pref ranking 🕯️</AppText>
      <AppText variant="body" color={colors.muted}>
        Built from your own ratings — later rounds weigh more. Reorder until it matches your gut,
        then copy this order onto your MRABA.
      </AppText>

      <Card style={[styles.warning, { borderColor: warnColor }]}>
        <AppText variant="caption" weight="bold" color={warnColor}>
          {warning.severity === 'none' ? 'MAXIMIZING OPTIONS ✓' : 'HEADS UP'}
        </AppText>
        <AppText variant="small">{warning.message}</AppText>
      </Card>

      <SectionHeader title="Your order" subtitle="Tap the arrows to move a house" />
      <View style={styles.cards}>
        {order.map((house, i) => {
          const isDropped = dropped.includes(house.id);
          return (
            <Card key={house.id} style={isDropped ? styles.droppedCard : undefined}>
              <View style={styles.row}>
                <View style={styles.rankBadge}>
                  <AppText variant="body" weight="bold" color={colors.white}>
                    {isDropped ? '—' : i + 1}
                  </AppText>
                </View>
                <View style={styles.rowText}>
                  <AppText weight="semibold" color={isDropped ? colors.muted : colors.ink}>
                    {house.name}
                  </AppText>
                  <AppText variant="caption" color={colors.muted}>
                    {houseScore(house) > 0
                      ? `your score ${houseScore(house).toFixed(1)}/5 · ${attendedRounds(house).length} rounds`
                      : 'not yet rated'}
                  </AppText>
                </View>
                <View style={styles.arrows}>
                  <Pressable onPress={() => move(i, -1)} hitSlop={8}>
                    <AppText variant="subheading" color={colors.primary}>
                      ↑
                    </AppText>
                  </Pressable>
                  <Pressable onPress={() => move(i, 1)} hitSlop={8}>
                    <AppText variant="subheading" color={colors.primary}>
                      ↓
                    </AppText>
                  </Pressable>
                </View>
              </View>
              <Button
                label={isDropped ? 'Put back on my list' : 'Leave this house off'}
                variant="ghost"
                onPress={() =>
                  setDropped((d) =>
                    d.includes(house.id) ? d.filter((x) => x !== house.id) : [...d, house.id],
                  )
                }
              />
            </Card>
          );
        })}
      </View>

      <Button
        label="Save my ranking"
        onPress={() => {
          const finalOrder = order.filter((h) => !dropped.includes(h.id)).map((h) => h.id);
          setPrefOrder(finalOrder);
          track('pref_ranking_saved', {
            listed: finalOrder.length,
            attended: attendedPref || order.length,
            maximized: warning.severity === 'none',
          });
          router.back();
        }}
        style={styles.save}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  warning: { marginTop: spacing.lg, borderWidth: 2, gap: spacing.xs },
  cards: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  arrows: { gap: spacing.xs, alignItems: 'center' },
  droppedCard: { opacity: 0.55 },
  save: { marginTop: spacing.xxl },
});
