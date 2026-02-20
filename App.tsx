import React, { useState } from 'react';
import { I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen, QuranScreen, QuranReaderScreen, PrayerTimesScreen, SettingsScreen } from './src/screens';
import { AnimatedDrawer, DrawerItem } from './src/components/AnimatedDrawer';
import { t } from './src/i18n';

// Force RTL for Arabic-first app
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

const Stack = createNativeStackNavigator();

const DRAWER_ITEMS: DrawerItem[] = [
  { key: 'Home', label: t('home'), icon: 'home' },
  { key: 'Quran', label: t('quran'), icon: 'quran' },
  { key: 'PrayerTimes', label: t('prayerTimes'), icon: 'mosque' },
  { key: 'Settings', label: t('settings'), icon: 'cog' },
];

const SCREENS: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen,
  Quran: QuranScreen,
  PrayerTimes: PrayerTimesScreen,
  Settings: SettingsScreen,
};

function MainWithDrawer() {
  const [activeScreen, setActiveScreen] = useState('Home');
  const ActiveComponent = SCREENS[activeScreen] ?? HomeScreen;

  return (
    <AnimatedDrawer
      items={DRAWER_ITEMS}
      activeKey={activeScreen}
      onSelect={setActiveScreen}
    >
      <ActiveComponent />
    </AnimatedDrawer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
          <Stack.Screen name="Main" component={MainWithDrawer} />
          <Stack.Screen name="QuranReader" component={QuranReaderScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
