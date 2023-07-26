import * as Device from 'expo-device'
import * as Notifs from 'expo-notifications'
import { useState } from 'react';
import * as firestore from '../hooks/firebase/useFirestore'
import useAsyncEffect from './useAsyncEffect'

// string (token) if granted, false if denied, null if undetermined
let pushtoken: string | false | null = null;

Notifs.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: false,
  }),
});

export async function requestPushToken(): Promise<string | false> {
  {
    const { status } = await Notifs.getPermissionsAsync();
    if (!Device.isDevice) return false; // cannot use push notifs on simulator/emulator

    switch (status) {
      case 'granted':
        return pushtoken = await updatePushToken();
      case 'denied':
        return pushtoken = false;
    }
  }

  {
    const { granted } = await Notifs.getPermissionsAsync();
    if (!granted) return pushtoken = false;
    return pushtoken = await updatePushToken();
  }
}

async function updatePushToken(): Promise<string> {
  const token = (await Notifs.getExpoPushTokenAsync()).data;
  pushtoken = token;
  await firestore.updatePushToken(token);
  return token;
}

/**
 * Use notifications. Only works on devices. Only asks the user once for permission. When denied,
 * you can still call `requestPushToken` from this module to ask again.
 */
export default function useNotifs() {
  const [token, setToken] = useState(pushtoken);
  useAsyncEffect(async () => {
    if (pushtoken === null)
      setToken(await requestPushToken());
  }, []);
  return token;
}
