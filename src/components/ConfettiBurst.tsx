import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';

const PIECE_COLORS = [
  colors.primary,
  colors.primarySoft,
  colors.success,
  colors.warning,
  colors.info,
  colors.primaryDark,
];

const PIECE_COUNT = 12;
const FALL_MS = 1200;

interface PieceProps {
  index: number;
  onLast?: () => void;
}

function Piece({ index }: PieceProps) {
  const { width, height } = Dimensions.get('window');
  // deterministic pseudo-random layout per index
  const x = ((index * 83) % 100) / 100;
  const delay = (index * 47) % 300;
  const rotation = ((index % 2 === 0 ? 1 : -1) * ((index * 131) % 360)) + 180;
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      delay,
      withTiming(1, { duration: FALL_MS, easing: Easing.in(Easing.cubic) }),
    );
  }, [fall, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -40 + fall.value * (height * 0.7) },
      { rotate: `${fall.value * rotation}deg` },
    ],
    opacity: 1 - fall.value * 0.9,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: x * (width - 20), backgroundColor: PIECE_COLORS[index % PIECE_COLORS.length] },
        style,
      ]}
    />
  );
}

/** Duolingo-style celebration: 12 staggered falling pieces. Mount to fire once. */
export function ConfettiBurst() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECE_COUNT }, (_, i) => (
        <Piece key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 14,
    borderRadius: 3,
  },
});
