import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifs from 'expo-notifications';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import useAsyncEffect from './useAsyncEffect';
import { clearPushToken, setPushToken } from '../misc/api';

const tokenAtom = atom<string | false | null>(null);

Notifs.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: false,
  }),
});

export async function requestPushToken(): Promise<string | false> {
  {
    const { status, canAskAgain } = await Notifs.getPermissionsAsync();
    if (!Device.isDevice) return false; // cannot use push notifs on simulator/emulator

    switch (status) {
    case 'granted':
      return await updatePushToken();
    case 'denied':
      if (!canAskAgain)
        return false;
    }
  }

  {
    const { granted } = await Notifs.requestPermissionsAsync();
    if (!granted) return false;
    return await updatePushToken();
  }
}

async function updatePushToken(token?: string): Promise<string | false> {
  if (!token) token = (await Notifs.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  getDefaultStore().set(tokenAtom, token);
  if (!await setPushToken(token)) {
    getDefaultStore().set(tokenAtom, null);
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifs.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifs.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

/**
 * Use notifications. Only works on devices. Only asks the user once for permission. When denied,
 * you can still call `requestPushToken` from this module to ask again.
 */
export default function useNotifs() {
  const [token, setToken] = useAtom(tokenAtom);
  useAsyncEffect(async () => {
    if (getDefaultStore().get(tokenAtom) === null)
      requestPushToken();
  }, []);
  const clearToken = useCallback(async () => {
    if (!token) return;
    setToken(false);
    if (!await clearPushToken(token)) setToken(token);
  }, [token]);
  return { token, clearToken };
}
