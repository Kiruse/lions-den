import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getJWTPayload } from '../misc/helpers';

const storage = createJSONStorage<string | null>(() => AsyncStorage);
const tokenAtom = atomWithStorage<string | null>('token', null, storage);
const addressAtom = atom(
  async (get): Promise<string | undefined> => {
    const token = await get(tokenAtom);
    if (!token) return;
    try {
      return (getJWTPayload(token) || {}).address;
    } catch (err) {
      console.error("Failed to parse token:", err);
      return;
    }
  }
)

export const useToken = () => useAtomValue(tokenAtom);
export const useAddress = () => useAtomValue(addressAtom);

export async function setToken(value: string | null) {
  await getDefaultStore().set(tokenAtom, value);
}
export async function getToken() {
  return await getDefaultStore().get(tokenAtom);
}
