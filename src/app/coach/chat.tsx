import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import {
  buildCoachContext,
  CoachUnavailableError,
  isCoachMockMode,
  sendCoachMessage,
} from '@/features/coach/coachClient';
import { mockCoachReply } from '@/features/coach/mockCoach';
import { track } from '@/lib/analytics';
import { makeId } from '@/lib/id';
import { ChatBubble, useCoachStore } from '@/state/coachStore';
import { useChecklistStore } from '@/state/checklistStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, fonts, fontSizes, radii, spacing } from '@/theme';
import type { CoachChatRequest } from '../../../shared/coach';

const STARTER_SUGGESTIONS = [
  'What should I work on next?',
  'Explain rec letters',
  'What do I wear to Pref?',
];

function TypingDots() {
  return (
    <Animated.View entering={FadeIn} style={[styles.bubble, styles.coachBubble]}>
      <AppText variant="body" color={colors.muted}>
        🎀 typing…
      </AppText>
    </Animated.View>
  );
}

export default function CoachChatScreen() {
  const insets = useSafeAreaInsets();
  const profile = useProfileStore((s) => s.profile);
  const done = useChecklistStore((s) => s.done);
  const messages = useCoachStore((s) => s.messages);
  const addMessage = useCoachStore((s) => s.addMessage);
  const clearChat = useCoachStore((s) => s.clearChat);
  const [draft, setDraft] = useState('');
  const [waiting, setWaiting] = useState(false);
  const listRef = useRef<FlatList<ChatBubble>>(null);

  const lastSuggestions = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    return messages.length === 0
      ? STARTER_SUGGESTIONS
      : (lastAssistant?.suggestions ?? []);
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || waiting || !profile) return;
      setDraft('');
      const userBubble: ChatBubble = { id: makeId('msg'), role: 'user', text: clean };
      addMessage(userBubble);
      setWaiting(true);

      const history = [...messages, userBubble]
        .slice(-12)
        .map((m) => ({ role: m.role, text: m.text }));
      const request: CoachChatRequest = {
        messages: history,
        context: buildCoachContext(profile, done),
      };

      const deliver = (reply: string, suggestions: string[], source: 'claude' | 'mock') => {
        addMessage({
          id: makeId('msg'),
          role: 'assistant',
          text: reply,
          suggestions,
          source,
        });
        track('coach_message', { source });
        setWaiting(false);
      };

      async function attempt() {
        try {
          const { response, source } = await sendCoachMessage(request);
          deliver(response.reply, response.suggestions, source);
        } catch (err) {
          setWaiting(false);
          const message =
            err instanceof CoachUnavailableError
              ? err.message
              : 'Something went wrong reaching the coach.';
          Alert.alert('Coach unavailable', message, [
            {
              text: 'Retry',
              onPress: () => {
                setWaiting(true);
                attempt();
              },
            },
            {
              text: 'Demo answer',
              onPress: () => {
                const mock = mockCoachReply(request);
                deliver(mock.reply, mock.suggestions, 'mock');
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]);
        }
      }
      await attempt();
    },
    [messages, waiting, profile, done, addMessage],
  );

  if (!profile) return null;

  const data = [...messages].reverse();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
        <View style={styles.headerText}>
          <AppText variant="subheading" weight="semibold" center>
            Your coach 🎀
          </AppText>
          <AppText variant="caption" color={colors.muted} center>
            {isCoachMockMode() ? 'demo mode' : 'powered by Claude'}
          </AppText>
        </View>
        <Button label="Clear" variant="ghost" onPress={clearChat} style={styles.back} />
      </View>

      <FlatList
        ref={listRef}
        data={data}
        inverted
        keyExtractor={(m) => m.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={waiting ? <TypingDots /> : null}
        ListFooterComponent={
          <View style={styles.welcome}>
            <AppText variant="hero" center>
              🎀
            </AppText>
            <AppText variant="body" color={colors.muted} center>
              Hey {profile.name}! I know your whole game plan — ask me what to work on,
              or anything about rush.
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInDown.duration(250)}
            style={[
              styles.bubble,
              item.role === 'user' ? styles.userBubble : styles.coachBubble,
            ]}>
            <AppText
              variant="body"
              color={item.role === 'user' ? colors.white : colors.ink}>
              {item.text}
            </AppText>
          </Animated.View>
        )}
      />

      {lastSuggestions.length > 0 && !waiting ? (
        <View style={styles.suggestions}>
          {lastSuggestions.map((s) => (
            <Chip key={s} label={s} onPress={() => send(s)} />
          ))}
        </View>
      ) : null}

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask your coach…"
          placeholderTextColor={colors.muted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => send(draft)}
          returnKeyType="send"
          multiline
        />
        <Pressable
          onPress={() => send(draft)}
          disabled={!draft.trim() || waiting}
          style={[styles.sendBtn, (!draft.trim() || waiting) && styles.sendDisabled]}>
          <AppText variant="subheading" color={colors.white}>
            ↑
          </AppText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.cream,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerText: { flex: 1 },
  back: { minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm },
  list: { flex: 1 },
  listContent: { padding: spacing.lg, gap: spacing.sm },
  welcome: { paddingVertical: spacing.xl, gap: spacing.sm, paddingHorizontal: spacing.xl },
  bubble: {
    maxWidth: '85%',
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginVertical: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radii.sm,
  },
  coachBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: radii.sm,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.cream,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
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
});
