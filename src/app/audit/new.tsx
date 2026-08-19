import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeader } from '@/components/SectionHeader';
import {
  AuditUnavailableError,
  isMockMode,
  runAudit,
  StoredAuditResult,
} from '@/features/audit/auditClient';
import { mockAudit } from '@/features/audit/mockAudit';
import { PreparedPhoto, preparePhoto } from '@/features/audit/prepareImages';
import { useShareStore } from '@/features/audit/shareIntent';
import { resolveSchool } from '@/features/checklist/buildChecklist';
import { track } from '@/lib/analytics';
import { makeId } from '@/lib/id';
import { useAuditStore } from '@/state/auditStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, radii, spacing } from '@/theme';
import type { AuditRequest } from '../../../shared/audit';

const MAX_PHOTOS = 12;
const GRID_THRESHOLD = 9;

export default function NewAuditScreen() {
  const [photos, setPhotos] = useState<PreparedPhoto[]>([]);
  const [caption, setCaption] = useState(() => useShareStore.getState().pending?.text ?? '');
  const [bio, setBio] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const addResult = useAuditStore((s) => s.addResult);
  const profile = useProfileStore((s) => s.profile);
  const consumePending = useShareStore((s) => s.consumePending);
  // Content handed off from the OS share sheet (Instagram/TikTok → Rush AI):
  // consumed once, before first render, so text can seed initial state
  const [shared] = useState(() => consumePending());

  useEffect(() => {
    if (!shared || shared.files.length === 0) return;
    Promise.all(
      shared.files.slice(0, MAX_PHOTOS).map((f) => preparePhoto(f, makeId('photo'))),
    )
      .then((prepared) =>
        setPhotos((prev) => [...prev, ...prepared].slice(0, MAX_PHOTOS)),
      )
      .catch(() => {
        Alert.alert(
          'Import failed',
          'Could not read the shared photos — try picking them from your library instead.',
        );
      });
  }, [shared]);

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.9,
    });
    if (result.canceled) return;
    const prepared = await Promise.all(
      result.assets.map((asset) => preparePhoto(asset, makeId('photo'))),
    );
    setPhotos((prev) => [...prev, ...prepared].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.item.id !== id));
  };

  const buildRequest = (): AuditRequest => {
    const items: AuditRequest['items'] = photos.map((p) => p.item);
    if (bio.trim()) {
      items.push({ id: makeId('bio'), kind: 'bio', text: bio.trim() });
    }
    if (caption.trim()) {
      items.push({ id: makeId('caption'), kind: 'caption', text: caption.trim() });
    }
    const school = profile ? resolveSchool(profile) : null;
    return {
      items,
      context: school
        ? { schoolName: school.name, region: school.region }
        : undefined,
    };
  };

  const storeAndShow = (
    request: AuditRequest,
    response: Omit<StoredAuditResult, 'id' | 'createdAt' | 'itemsMeta'>,
  ) => {
    const result: StoredAuditResult = {
      ...response,
      id: makeId('audit'),
      createdAt: new Date().toISOString(),
      itemsMeta: request.items.map((item) => ({
        id: item.id,
        kind: item.kind,
        thumbnailUri: photos.find((p) => p.item.id === item.id)?.thumbnailUri,
        text: item.text,
      })),
    };
    addResult(result);
    track('audit_completed', {
      source: response.source,
      score: Math.round(response.overallScore),
      itemCount: request.items.length,
      photoCount: photos.length,
      gridMode: photos.length >= GRID_THRESHOLD,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/audit/${result.id}`);
  };

  const start = async () => {
    const request = buildRequest();
    if (request.items.length === 0) return;
    setAnalyzing(true);
    try {
      const { response, source } = await runAudit(request);
      storeAndShow(request, { ...response, source });
    } catch (err) {
      setAnalyzing(false);
      const message =
        err instanceof AuditUnavailableError
          ? err.message
          : 'Something went wrong running the audit.';
      Alert.alert('Audit unavailable', message, [
        { text: 'Retry', onPress: () => start() },
        {
          text: 'Show demo results',
          onPress: () => {
            setAnalyzing(true);
            storeAndShow(request, { ...mockAudit(request), source: 'mock' });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
  };

  const itemCount = photos.length + (bio.trim() ? 1 : 0) + (caption.trim() ? 1 : 0);

  if (analyzing) {
    return (
      <LinearGradient colors={[colors.blush, colors.primarySoft]} style={styles.analyzing}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
        <AppText variant="title" center>
          Reviewing like a chapter would…
        </AppText>
        <AppText variant="body" color={colors.primaryDark} center>
          Checking vibes, flags, and grid cohesion. About a minute.
        </AppText>
      </LinearGradient>
    );
  }

  return (
    <Screen safeTop>
      <Button label="← Back" variant="ghost" onPress={() => router.back()} style={styles.back} />
      <AppText variant="title">New social audit</AppText>
      <AppText variant="body" color={colors.muted}>
        Add up to {MAX_PHOTOS} photos plus your bio or captions.{' '}
        {isMockMode() ? 'Demo mode: results are realistic samples.' : 'Analyzed privately by Claude.'}
      </AppText>

      <SectionHeader
        title="Photos"
        subtitle={`Grid posts, tagged photos, anything you're unsure about — add ${GRID_THRESHOLD}+ for full grid feedback`}
      />
      {photos.length >= GRID_THRESHOLD ? (
        <View style={styles.gridBadge}>
          <AppText variant="caption" weight="bold" color={colors.white}>
            ✨ GRID MODE — you&apos;ll get cohesion & ordering feedback
          </AppText>
        </View>
      ) : null}
      <View style={styles.grid}>
        {photos.map((p) => (
          <Pressable
            key={p.item.id}
            onLongPress={() => removePhoto(p.item.id)}
            style={styles.thumbWrap}>
            <Image source={{ uri: p.thumbnailUri }} style={styles.thumb} />
            <Pressable style={styles.removeDot} onPress={() => removePhoto(p.item.id)}>
              <AppText variant="caption" weight="bold" color={colors.white}>
                ✕
              </AppText>
            </Pressable>
          </Pressable>
        ))}
        {photos.length < MAX_PHOTOS ? (
          <Pressable onPress={pickPhotos} style={styles.addThumb}>
            <AppText variant="title" color={colors.primary}>
              +
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <SectionHeader title="Bio" subtitle="Paste your Instagram/TikTok bio" />
      <SearchInput
        placeholder="e.g. bama '27 🐘 | nashville"
        value={bio}
        onChangeText={setBio}
        autoCapitalize="none"
      />

      <SectionHeader title="Caption" subtitle="Paste a caption you're unsure about" />
      <SearchInput
        placeholder="Paste a caption…"
        value={caption}
        onChangeText={setCaption}
        autoCapitalize="sentences"
        multiline
        style={styles.multiline}
      />

      <Button
        label={itemCount === 0 ? 'Add something to audit' : `Audit ${itemCount} item${itemCount === 1 ? '' : 's'}`}
        onPress={start}
        disabled={itemCount === 0}
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  gridBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.info,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrap: { position: 'relative' },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radii.md,
    backgroundColor: colors.blush,
  },
  removeDot: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.ink,
    borderRadius: radii.pill,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addThumb: {
    width: 96,
    height: 96,
    borderRadius: radii.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blush,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  cta: { marginTop: spacing.xxl },
  analyzing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
});
