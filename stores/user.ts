import { atom, getDefaultStore, useAtomValue } from 'jotai';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { snackbar } from '../components/LionSnackbars';
import { getJWTPayload } from '../misc/helpers';
import request from '../misc/requests';

export type UserType = 'anonymous' | 'wallet';

// baseAtom is undefined if initial, null if failed, or JWT string if logged in (inc. anonymously)
const baseAtom = atom<string | null | undefined>(null);

// tokenAtom wraps baseAtom and persists to AsyncStorage
const tokenAtom = atom(
  (get) => get(baseAtom),
  async (_get, set, value: string | null) => {
    (global as any).token = value; // should ONLY EVER be used for requests.ts
    await Promise.all([
      set(baseAtom, value),
      value
        ? AsyncStorage.setItem('token', value || '')
        : AsyncStorage.removeItem('token'),
    ]);
  },
)

// restore session or log in anonymously upon startup
AsyncStorage.getItem('token').then(async token => {
  if (!token) {
    token = (await loginAnonymously()) || null;
  } else {
    const tmp = await refresh(token);
    if (tmp) token = tmp;
  }

  // set even if null, indicating failure
  await getDefaultStore().set(tokenAtom, token);
});

const payloadAtom = atom(
  async (get) => {
    const token = await get(tokenAtom);
    if (!token) return;
    try {
      return getJWTPayload(token);
    } catch (err) {
      console.error("Failed to parse token:", err);
      return;
    }
  }
)

const addressAtom = atom(
  async (get) => (await get(payloadAtom) || {}).address as string | undefined
)

const typeAtom = atom(
  async (get) => (await get(payloadAtom) || {}).type as UserType | undefined
)

export const useToken = () => useAtomValue(tokenAtom);
export const useUser = () => useAtomValue(payloadAtom);
export const useAddress = () => useAtomValue(addressAtom);
export const useUserType = () => useAtomValue(typeAtom);

export async function setToken(value: string | null) {
  await getDefaultStore().set(tokenAtom, value);
}
export async function getToken() {
  return await getDefaultStore().get(tokenAtom);
}

async function loginAnonymously(): Promise<string | undefined> {
  try {
    const token = await request({
      method: 'GET',
      api: 'cosmos-link',
      url: 'v1/login?type=anonymous',
      expects: 'text',
    });
    return token;
  } catch (err) {
    console.error('Failed to login anonymously:', err);
    snackbar({
      mode: 'error',
      title: 'Login Error',
      content: 'Failed to login anonymously. Please make sure you are connected to the internet and try again.',
    });
  }
}

export async function login(token: string) {
  // if we have an existing anonymous token, upgrade it. otherwise just log in.
  const existingToken = await getToken();

  const type = existingToken ? getJWTPayload(existingToken)?.type : null;
  if (type === 'anonymous')
    return await _upgrade(token);
  return await _login(token);
}

async function _login(token: string) {
  try {
    await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/login',
      body: token,
    });
    await setToken(token);
  } catch (err: any) {
    console.error('Failed to login:', err);
    snackbar({
      mode: 'error',
      content: 'Failed to login: ' + err.message || 'Unknown error',
    });
  }
}

async function _upgrade(token: string) {
  try {
    await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/upgrade',
      body: token,
    });
    await setToken(token);
  } catch (err: any) {
    console.error('Failed to upgrade user:', err);
    snackbar({
      mode: 'error',
      content: 'Failed to upgrade account: ' + err.message || 'Unknown error',
    });
  }
}

export async function recover(tokenID: string) {
  return await request({
    method: 'POST',
    api: 'cosmos-link',
    url: 'v1/recover',
    type: 'text',
    expects: 'text',
    body: tokenID,
  });
}

// refresh using the original token. server may or may not respond with a new token or simply return
// the old token.
async function refresh(token: string) {
  try {
    return await request({
      method: 'POST',
      api: 'cosmos-link',
      url: 'v1/refresh',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      expects: 'text',
    }) as string;
  } catch (err) {
    console.error('Failed to refresh token:', err);
  }
}

export async function logout() {
  const token = await loginAnonymously();
  await setToken(token || null);
}
