import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { SearchInput } from '@/components/SearchInput';
import { track } from '@/lib/analytics';
import { useProfileStore } from '@/state/profileStore';
import { colors, spacing } from '@/theme';
import type { RushOutcome } from '@/types';

const statusOptions: { key: RushOutcome['status']; label: string }[] = [
  { key: 'bid', label: '💌 I got a bid!' },
  { key: 'still_rushing', label: '⏳ Still going' },
  { key: 'no_bid', label: '💔 No bid this time' },
  { key: 'withdrew', label: '🚪 I withdrew' },
];

const followUp: Record<RushOutcome['status'], string> = {
  bid: 'Ahh congratulations!! 🎉 Go run home — and enjoy every second of it.',
  still_rushing:
    "Rooting for you! Keep your notes going after each party, and check back in when it's done. 💗",
  no_bid:
    "I'm sorry — that stings, and it says less about you than it feels like. COB and next year are real paths, and your coach is here whenever you want to talk it through. 💗",
  withdrew:
    'Totally valid — rush is a lot, and knowing what you want counts for everything. The door stays open if you ever want to try again. 💗',
};

/** Post-Bid-Day check-in: records how recruitment went (and optionally where). */
export function OutcomeCheckIn() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<RushOutcome['status'] | null>(null);
  const [chapter, setChapter] = useState('');

  if (!profile) return null;
  const outcome = profile.outcome;

  const save = () => {
    if (!status) return;
    const next: RushOutcome = {
      status,
      chapter: chapter.trim() || undefined,
      recordedAt: new Date().toISOString(),
    };
    updateProfile({ outcome: next });
    track('outcome_recorded', {
      status: next.status,
      hasChapter: !!next.chapter,
      schoolId: profile.schoolId,
      rushYear: profile.rushYear,
    });
    setEditing(false);
  };

  if (outcome && !editing) {
    return (
      <Card style={styles.card}>
        <AppText weight="semibold">
          {statusOptions.find((o) => o.key === outcome.status)?.label}
          {outcome.chapter ? ` · ${outcome.chapter}` : ''}
        </AppText>
        <AppText variant="small" color={colors.muted}>
          {followUp[outcome.status]}
        </AppText>
        <Button
          label="Update"
          variant="ghost"
          onPress={() => {
            setStatus(outcome.status);
            setChapter(outcome.chapter ?? '');
            setEditing(true);
          }}
        />
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <AppText weight="semibold">How did rush go? 🎀</AppText>
      <AppText variant="small" color={colors.muted}>
        Tell us how it ended — it helps us make Rush AI better for the next PNM.
      </AppText>
      <View style={styles.chips}>
        {statusOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={opt.label}
            selected={status === opt.key}
            onPress={() => setStatus(opt.key)}
          />
        ))}
      </View>
      {status === 'bid' ? (
        <SearchInput
          placeholder="Which chapter? (optional)"
          value={chapter}
          onChangeText={setChapter}
          autoCapitalize="words"
        />
      ) : null}
      <Button label="Save" onPress={save} disabled={!status} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
