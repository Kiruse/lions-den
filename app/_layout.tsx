import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import * as Splash from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { MD3Theme, PaperProvider, MD3LightTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import tinycolor from 'tinycolor2'
import { ping, useUser } from '../hooks/firebase';
import LionSnackbars from '../components/LionSnackbars'

Splash.preventAutoHideAsync();
enableScreens(true);

const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#f3f410',
    primary: '#C53636',
    onPrimary: '#f3f410',
    secondary: '#5f00cc',
    onSecondary: '#ffffff',
  },
}

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
    <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        detachInactiveScreens
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            paddingBottom: 4,
            paddingTop: 4,
          },
          tabBarActiveTintColor: theme.colors.onPrimary,
          tabBarInactiveTintColor: tinycolor(theme.colors.primary).darken(20).toRgbString(),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: '/',
            title: 'Home',
            tabBarIcon: props => <Ionicons name="home-outline" {...props} />,
          }}
        />
        <Tabs.Screen
          name="daos"
          options={{
            href: '/daos',
            title: 'DAOs',
            headerShown: false,
            tabBarIcon: props => <MaterialIcons name="groups" {...props} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            href: '/account',
            title: 'Account',
            tabBarIcon: props => <MaterialCommunityIcons name="account" {...props} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: '/settings',
            title: 'Settings',
            tabBarIcon: props => <Ionicons name="settings-outline" {...props} />,
          }}
        />
        <Tabs.Screen
          name="post-login"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <LionSnackbars />
    </SafeAreaProvider>
    </PaperProvider>
  );
}
