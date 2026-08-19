import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { Screen } from '@/components/Screen';
import { buildChecklist, resolveSchool } from '@/features/checklist/buildChecklist';
import { phaseMeta, phaseOrder } from '@/features/checklist/phases';
import { useChecklistStore } from '@/state/checklistStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, radii, spacing } from '@/theme';
import type { GeneratedChecklistItem, Phase } from '@/types';

export default function ChecklistScreen() {
  const profile = useProfileStore((s) => s.profile);
  const done = useChecklistStore((s) => s.done);
  const toggle = useChecklistStore((s) => s.toggle);

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
  const pct = items.length === 0 ? 0 : Math.round((completed / items.length) * 100);

  const handleToggle = (id: string) => {
    if (!done[id]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    toggle(id);
  };

  return (
    <Screen safeTop>
      <AppText variant="title">Your game plan</AppText>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
      <AppText variant="small" color={colors.muted}>
        {completed} of {items.length} done · personalized for your school & timeline
      </AppText>

      {grouped.map(({ phase, items: phaseItems }) => (
        <View key={phase}>
          <AppText variant="heading" style={styles.phaseTitle}>
            {phaseMeta[phase].emoji} {phaseMeta[phase].label}
          </AppText>
          <View style={styles.cards}>
            {phaseItems.map((item) => {
              const checked = !!done[item.id];
              return (
                <Card key={item.id} style={checked ? styles.doneCard : undefined}>
                  <View style={styles.row}>
                    <Checkbox checked={checked} onToggle={() => handleToggle(item.id)} />
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
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.blush,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
  phaseTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  cards: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  rowText: { flex: 1, gap: 2 },
  doneCard: { opacity: 0.75 },
  struck: { textDecorationLine: 'line-through' },
});
