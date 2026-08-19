import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, fonts } from '@/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <AppText variant="subheading" style={{ opacity: focused ? 1 : 0.45 }}>
      {emoji}
    </AppText>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemiBold,
          fontSize: 11,
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarBackground: () => (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill}>
            {/* warm wash so the blur reads as cream, not gray */}
            <View style={styles.overlay} />
          </BlurView>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Plan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="✅" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="houses"
        options={{
          title: 'Houses',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏛️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎀" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 247, 250, 0.72)',
  },
});
