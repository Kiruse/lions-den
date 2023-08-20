import { Buffer } from 'buffer';
import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = createJSONStorage<string | null>(() => AsyncStorage);
const tokenAtom = atomWithStorage<string | null>('token', null, storage);
const addressAtom = atom(
  async (get) => {
    const token = await get(tokenAtom);
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      const { address } = JSON.parse(Buffer.from(payload, 'base64').toString());
      return address;
    } catch (err) {
      console.error("Failed to parse token:", err);
    }
  }
)

export const useToken = () => useAtomValue(tokenAtom);
export const useAddress = () => useAtomValue(addressAtom);
export function setToken(value: string | null) {
  getDefaultStore().set(tokenAtom, value);
}
