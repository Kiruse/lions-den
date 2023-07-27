import * as db from 'firebase/firestore'
import { News } from '../../misc/types'
import app from './app'
import * as auth from './useAuth'

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

/** Get official news from the Firestore */
export async function getNews(startAfter = new Date(), limit = 10): Promise<News[]> {
  const newsref = db.collection(firestore, 'news');
  const q = db.query(
    newsref,
    db.orderBy('date', 'desc'),
    db.where('date', '<', startAfter),
    db.limit(limit),
  );
  const snap = await db.getDocs(q);
  return snap.docs.map(doc => doc.data()) as News[];
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
