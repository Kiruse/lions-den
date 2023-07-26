import { Tabs } from 'expo-router'
import * as Splash from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ping, useUser } from '../hooks/firebase';

Splash.preventAutoHideAsync();
enableScreens(true);

export default function() {
  const [isAppReady, setAppReady] = React.useState(true); // nothing to load yet
  const user = useUser();

  React.useEffect(() => {
    if (isAppReady)
      Splash.hideAsync();
  }, [isAppReady]);

  React.useEffect(() => {
    if (user) ping();
  }, [user]);

  if (!user || !isAppReady) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        detachInactiveScreens
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: '/', title: 'Home' }}
        />
        <Tabs.Screen
          name="proposals"
          options={{ href: '/proposals', title: 'Props' }}
        />
        <Tabs.Screen
          name="settings"
          options={{ href: '/settings', title: 'Settings' }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
