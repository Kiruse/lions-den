import * as Device from 'expo-device'
import * as Notifs from 'expo-notifications'
import * as firestore from '../hooks/firebase/useFirestore'
import useAsyncEffect from './useAsyncEffect'
import { atom, getDefaultStore, useAtomValue } from 'jotai';

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
    const { granted } = await Notifs.getPermissionsAsync();
    if (!granted) return false;
    return await updatePushToken();
  }
}

async function updatePushToken(): Promise<string> {
  const token = (await Notifs.getExpoPushTokenAsync()).data;
  getDefaultStore().set(tokenAtom, token);
  await firestore.updatePushToken(token);
  return token;
}

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
