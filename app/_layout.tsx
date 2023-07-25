import { Tabs } from 'expo-router'
import * as Splash from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

Splash.preventAutoHideAsync();
enableScreens(true);

export default function() {
  const [isAppReady, setAppReady] = React.useState(true); // nothing to load yet
  
  React.useEffect(() => {
    if (isAppReady)
      Splash.hideAsync();
  }, [isAppReady]);
  
  if (!isAppReady) return null;
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
