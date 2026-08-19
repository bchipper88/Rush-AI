import * as Haptics from 'expo-haptics';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { ProgressRing } from '@/components/ProgressRing';
import { Screen } from '@/components/Screen';
import { buildChecklist, resolveSchool } from '@/features/checklist/buildChecklist';
import { phaseMeta, phaseOrder } from '@/features/checklist/phases';
import { track } from '@/lib/analytics';
import { useChecklistStore } from '@/state/checklistStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, radii, spacing } from '@/theme';
import type { GeneratedChecklistItem, Phase } from '@/types';

export default function ChecklistScreen() {
  const profile = useProfileStore((s) => s.profile);
  const done = useChecklistStore((s) => s.done);
  const toggle = useChecklistStore((s) => s.toggle);
  const [celebrating, setCelebrating] = useState(0);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = useMemo(
    () => (profile ? buildChecklist(profile, resolveSchool(profile)) : []),
    [profile],
  );

  const grouped = useMemo(() => {
    const map = new Map<Phase, GeneratedChecklistItem[]>();
    for (const item of items) {
      const list = map.get(item.phase) ?? [];
      list.push(item);
      map.set(item.phase, list);
    }
    return phaseOrder.filter((p) => map.has(p)).map((p) => ({ phase: p, items: map.get(p)! }));
  }, [items]);

  if (!profile) return null;

  const completed = items.filter((i) => done[i.id]).length;
  const progress = items.length === 0 ? 0 : completed / items.length;

  const handleToggle = (item: GeneratedChecklistItem) => {
    const nowDone = !done[item.id];
    toggle(item.id);
    track('checklist_toggled', { itemId: item.id, phase: item.phase, done: nowDone });
    if (!nowDone) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // fire confetti when this completes its phase
    const phaseItems = items.filter((i) => i.phase === item.phase);
    const phaseComplete = phaseItems.every((i) => (i.id === item.id ? true : done[i.id]));
    if (phaseComplete) {
      setCelebrating((n) => n + 1);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => setCelebrating(0), 1600);
    }
  };

  return (
    <View style={styles.root}>
      <Screen safeTop>
        <AppText variant="title">Your game plan</AppText>
        <View style={styles.ringWrap}>
          <ProgressRing progress={progress} label={`${completed} OF ${items.length}`} />
        </View>

        {grouped.map(({ phase, items: phaseItems }) => {
          const phaseDone = phaseItems.filter((i) => done[i.id]).length;
          return (
            <View key={phase}>
              <View style={styles.phaseHeader}>
                <AppText variant="heading">
                  {phaseMeta[phase].emoji} {phaseMeta[phase].label}
                </AppText>
                <View
                  style={[
                    styles.hudChip,
                    phaseDone === phaseItems.length && styles.hudChipDone,
                  ]}>
                  <AppText
                    variant="caption"
                    weight="bold"
                    color={phaseDone === phaseItems.length ? colors.white : colors.muted}>
                    {phaseDone}/{phaseItems.length}
                  </AppText>
                </View>
              </View>
              <View style={styles.cards}>
                {phaseItems.map((item) => {
                  const checked = !!done[item.id];
                  return (
                    <Card key={item.id} style={checked ? styles.doneCard : undefined}>
                      <View style={styles.row}>
                        <Checkbox checked={checked} onToggle={() => handleToggle(item)} />
                        <View style={styles.rowText}>
                          <AppText
                            weight="semibold"
                            color={checked ? colors.muted : colors.ink}
                            style={checked ? styles.struck : undefined}>
                            {item.title}
                          </AppText>
                          <AppText variant="caption" weight="semibold" color={colors.primary}>
                            {item.dueLabel}
                          </AppText>
                          {!checked ? (
                            <AppText variant="small" color={colors.muted}>
                              {item.detail}
                            </AppText>
                          ) : null}
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            </View>
          );
        })}
      </Screen>
      {celebrating > 0 ? <ConfettiBurst key={celebrating} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  ringWrap: { marginTop: spacing.lg, marginBottom: spacing.sm },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  hudChip: {
    backgroundColor: colors.blush,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  hudChipDone: { backgroundColor: colors.success, borderColor: colors.success },
  cards: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  rowText: { flex: 1, gap: 2 },
  doneCard: { opacity: 0.75 },
  struck: { textDecorationLine: 'line-through' },
});
