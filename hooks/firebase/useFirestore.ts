import * as db from 'firebase/firestore'
import app from './app';
import * as auth from './useAuth';

const firestore = db.getFirestore(app);

export async function ping() {
  const doc = getUserDoc();
  if (!doc) return;
  await db.setDoc(doc, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }, { merge: true });
}

export async function updatePushToken(pushToken: string) {
  const doc = getUserDoc();
  if (!doc) return;
  await db.setDoc(doc, {
    pushToken,
  }, { merge: true });
}

function getCurrentUser() {
  const user = auth.getCurrentUser();
  if (!user) console.warn('No user signed in, not even anonymously.');
  return user;
}

function getUserDoc() {
  const user = getCurrentUser();
  if (!user) return null;
  return db.doc(firestore, 'users', user.uid);
}
