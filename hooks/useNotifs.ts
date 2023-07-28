import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifs from 'expo-notifications'
import * as firestore from '../hooks/firebase/useFirestore'
import useAsyncEffect from './useAsyncEffect'
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { Platform } from 'react-native';

const tokenAtom = atom<string | false | null>(null);

Notifs.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: false,
  }),
});

export async function requestPushToken(askAnyway = false): Promise<string | false> {
  {
    const { status, canAskAgain } = await Notifs.getPermissionsAsync();
    if (!Device.isDevice) return false; // cannot use push notifs on simulator/emulator

    switch (status) {
      case 'granted':
        return await updatePushToken();
      case 'denied':
        if (!askAnyway || !canAskAgain)
          return false;
    }
  }

  {
    const { granted } = await Notifs.requestPermissionsAsync();
    if (!granted) return false;
    return await updatePushToken();
  }
}

async function updatePushToken(token?: string): Promise<string> {
  if (!token) token = (await Notifs.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;
  getDefaultStore().set(tokenAtom, token);
  await firestore.updatePushToken(token);
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

// in case push token changes while live
Notifs.addPushTokenListener(token => {
  updatePushToken(token.data);
});

/**
 * Use notifications. Only works on devices. Only asks the user once for permission. When denied,
 * you can still call `requestPushToken` from this module to ask again.
 */
export default function useNotifs() {
  const token = useAtomValue(tokenAtom);
  useAsyncEffect(async () => {
    if (getDefaultStore().get(tokenAtom) === null)
      requestPushToken();
  }, []);
  return token;
}
