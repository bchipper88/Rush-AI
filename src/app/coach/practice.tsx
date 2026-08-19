import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AgeGate } from '@/components/AgeGate';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { roundMeta, rushRounds } from '@/features/houses/houseUtils';
import {
  isPracticeMockMode,
  PracticeUnavailableError,
  runPracticeTurn,
} from '@/features/coach/practiceClient';
import { mockPractice } from '@/features/coach/practiceMock';
import { profileAge } from '@/features/onboarding/age';
import { resolveSchool } from '@/features/checklist/buildChecklist';
import { track } from '@/lib/analytics';
import { useProfileStore } from '@/state/profileStore';
import { colors, fonts, fontSizes, radii, spacing } from '@/theme';
import type {
  PracticeFeedback,
  PracticeMessage,
  PracticeRound,
} from '../../../shared/practice';

const SCORE_LABELS: { key: keyof PracticeFeedback['scores']; label: string }[] = [
  { key: 'warmth', label: 'Warmth' },
  { key: 'curiosity', label: 'Curiosity' },
  { key: 'story', label: 'Storytelling' },
  { key: 'poise', label: 'Poise' },
];

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.scoreRow}>
      <AppText variant="small" weight="semibold" style={styles.scoreLabel}>
        {label}
      </AppText>
      <View style={styles.scoreTrack}>
        <View style={[styles.scoreFill, { width: `${value * 10}%` }]} />
      </View>
      <AppText variant="small" weight="bold" color={colors.primaryDark}>
        {value}
      </AppText>
    </View>
  );
}

function PracticeScreen() {
  const profile = useProfileStore((s) => s.profile);
  const [round, setRound] = useState<PracticeRound | null>(null);
  const [messages, setMessages] = useState<PracticeMessage[]>([]);
  const [memberName, setMemberName] = useState<string>('');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);

  const buildRequest = (
    nextMessages: PracticeMessage[],
    finish: boolean,
    activeRound: PracticeRound,
  ) => ({
    round: activeRound,
    messages: nextMessages,
    finish,
    context: profile
      ? {
          name: profile.name,
          schoolName: resolveSchool(profile).name,
          age: profileAge(profile) ?? undefined,
        }
      : undefined,
  });

  const advance = async (nextMessages: PracticeMessage[], activeRound: PracticeRound) => {
    setBusy(true);
    try {
      const { response } = await runPracticeTurn(buildRequest(nextMessages, false, activeRound));
      if (response.memberName) setMemberName(response.memberName);
      if (response.reply) {
        setMessages([...nextMessages, { role: 'assistant', text: response.reply }]);
      }
    } catch (err) {
      const message =
        err instanceof PracticeUnavailableError ? err.message : 'Practice hit a snag.';
      Alert.alert('Practice unavailable', message, [
        {
          text: 'Use demo partner',
          onPress: () => {
            const mock = mockPractice(buildRequest(nextMessages, false, activeRound));
            if (mock.memberName) setMemberName(mock.memberName);
            if (mock.reply) {
              setMessages([...nextMessages, { role: 'assistant', text: mock.reply }]);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const start = async (chosen: PracticeRound) => {
    setRound(chosen);
    setMessages([]);
    setFeedback(null);
    setMemberName('');
    track('practice_started', { round: chosen });
    await advance([], chosen);
  };

  const send = async () => {
    if (!draft.trim() || !round || busy) return;
    const next: PracticeMessage[] = [...messages, { role: 'user', text: draft.trim() }];
    setDraft('');
    setMessages(next);
    await advance(next, round);
  };

  const finish = async () => {
    if (!round) return;
    setBusy(true);
    try {
      const { response, source } = await runPracticeTurn(buildRequest(messages, true, round));
      if (response.feedback) {
        setFeedback(response.feedback);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        track('practice_finished', {
          round,
          source,
          overall: response.feedback.overall,
          turns: messages.filter((m) => m.role === 'user').length,
        });
      }
    } catch {
      const mock = mockPractice(buildRequest(messages, true, round));
      if (mock.feedback) setFeedback(mock.feedback);
    } finally {
      setBusy(false);
    }
  };

  // ---- round picker ----
  if (!round) {
    return (
      <Screen safeTop>
        <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
        <AppText variant="title">Practice a conversation 🎭</AppText>
        <AppText variant="body" color={colors.muted}>
          Rush is won in five-minute conversations. Rehearse one — your coach plays the chapter
          member, then scores how you did.{' '}
          {isPracticeMockMode() ? 'Demo mode: scripted partner, real scoring.' : ''}
        </AppText>

        <SectionHeader title="Pick a round" />
        <View style={styles.cards}>
          {rushRounds.map((r) => (
            <Card key={r} onPress={() => start(r)}>
              <AppText weight="semibold">
                {roundMeta[r].emoji} {roundMeta[r].label}
              </AppText>
              <AppText variant="small" color={colors.muted}>
                {r === 'open_house'
                  ? 'Fast, loud, four minutes — nail your intro.'
                  : r === 'philanthropy'
                    ? 'Talk about causes you actually care about.'
                    : r === 'sisterhood'
                      ? 'Go deeper: fit, values, what you want.'
                      : 'The emotional one. Sincerity over polish.'}
              </AppText>
            </Card>
          ))}
        </View>
      </Screen>
    );
  }

  // ---- feedback ----
  if (feedback) {
    return (
      <Screen safeTop>
        <AppText variant="title">How you did 🎀</AppText>
        <View style={styles.overallWrap}>
          <AppText style={styles.overall} color={colors.primary}>
            {feedback.overall}
          </AppText>
          <AppText variant="caption" weight="bold" color={colors.muted}>
            OUT OF 100 · {roundMeta[round].label.toUpperCase()}
          </AppText>
        </View>

        <Card style={styles.card}>
          {SCORE_LABELS.map((s) => (
            <ScoreBar key={s.key} label={s.label} value={feedback.scores[s.key]} />
          ))}
        </Card>

        {feedback.wins.length > 0 ? (
          <>
            <SectionHeader title="What worked" />
            <Card style={styles.card}>
              {feedback.wins.map((w, i) => (
                <AppText key={i} variant="small">
                  ✓ {w}
                </AppText>
              ))}
            </Card>
          </>
        ) : null}

        {feedback.fixes.length > 0 ? (
          <>
            <SectionHeader title="Try next time" />
            <Card style={styles.card}>
              {feedback.fixes.map((f, i) => (
                <AppText key={i} variant="small">
                  → {f}
                </AppText>
              ))}
            </Card>
          </>
        ) : null}

        {feedback.fiveBsFlags.length > 0 ? (
          <Card style={[styles.card, styles.flagCard]}>
            <AppText variant="caption" weight="bold" color={colors.warning}>
              FIVE B&apos;S FLAGGED
            </AppText>
            <AppText variant="small">
              {feedback.fiveBsFlags.join(', ')} came up. Members are trained to avoid these —
              redirect to campus life, classes, or her chapter experience.
            </AppText>
          </Card>
        ) : null}

        <Button label="Practice again" onPress={() => start(round)} style={styles.cta} />
        <Button label="Back to Coach" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  // ---- conversation ----
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={styles.convoHeader}>
          <AppText variant="heading">
            {roundMeta[round].emoji} {roundMeta[round].label}
          </AppText>
          <AppText variant="small" color={colors.muted}>
            {memberName ? `You're talking with ${memberName}` : 'Starting the party…'}
          </AppText>
        </View>

        <ScrollView contentContainerStyle={styles.bubbles}>
          {messages.map((m, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.duration(220)}
              style={[
                styles.bubble,
                m.role === 'user' ? styles.userBubble : styles.memberBubble,
              ]}>
              <AppText variant="body" color={m.role === 'user' ? colors.white : colors.ink}>
                {m.text}
              </AppText>
            </Animated.View>
          ))}
          {busy ? (
            <View style={[styles.bubble, styles.memberBubble]}>
              <AppText variant="body" color={colors.muted}>
                …
              </AppText>
            </View>
          ) : null}
        </ScrollView>
      </Screen>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What do you say?"
          placeholderTextColor={colors.muted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
          multiline
        />
        <Pressable
          onPress={send}
          disabled={!draft.trim() || busy}
          style={[styles.sendBtn, (!draft.trim() || busy) && styles.sendDisabled]}>
          <AppText variant="subheading" color={colors.white}>
            ↑
          </AppText>
        </Pressable>
      </View>
      <View style={styles.finishRow}>
        <Button
          label={messages.some((m) => m.role === 'user') ? 'Finish & get feedback' : 'Cancel'}
          variant="secondary"
          onPress={() => (messages.some((m) => m.role === 'user') ? finish() : router.back())}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  cards: { gap: spacing.sm },
  convoHeader: { paddingTop: spacing.xxl, gap: 2 },
  bubbles: { gap: spacing.sm, paddingVertical: spacing.lg },
  bubble: {
    maxWidth: '88%',
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radii.sm,
  },
  memberBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radii.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.ink,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  finishRow: { padding: spacing.xl, paddingTop: spacing.md },
  overallWrap: { alignItems: 'center', marginTop: spacing.xl, gap: 2 },
  overall: { fontFamily: fonts.display, fontSize: 64, lineHeight: 70 },
  card: { gap: spacing.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scoreLabel: { width: 92 },
  scoreTrack: {
    flex: 1,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.blush,
    overflow: 'hidden',
  },
  scoreFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
  flagCard: { borderColor: colors.warning, borderWidth: 2 },
  cta: { marginTop: spacing.xxl },
});

export default function PracticeScreenGated() {
  return (
    <AgeGate>
      <PracticeScreen />
    </AgeGate>
  );
}
