import { getAuth, signInAnonymously, User } from 'firebase/auth'
import { atom, getDefaultStore, useAtomValue } from 'jotai'
import app from './app'

const auth = getAuth(app);
signInAnonymously(auth).catch(err => console.error(err));

auth.onAuthStateChanged(async user => {
  getDefaultStore().set(userAtom, user);
});

const userAtom = atom<User | null>(null);

export const useUser = () => useAtomValue(userAtom);
export const getCurrentUser = () => auth.currentUser;
