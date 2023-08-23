import * as db from 'firebase/firestore'
import { News } from '../../misc/types'
import app from './app'

const firestore = db.getFirestore(app);

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
