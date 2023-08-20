import type { FirestoreDate } from './types'

export const isFirestoreDate = (date: any): date is FirestoreDate => date && typeof date === 'object' && typeof date.seconds === 'number' && typeof date.nanoseconds === 'number';
export const fromFirestoreDate = (date: FirestoreDate) => new Date(date.seconds * 1000 + date.nanoseconds / 1000000);

export function shortenBigNum(num: number | bigint | string) {
  num = num.toString();
  if (num.length < 7) return insertThousands(num);
  if (num.length < 10) return num.slice(0, -6) + '.' + num.slice(-6, -3) + 'M';
  if (num.length < 13) return num.slice(0, -9) + '.' + num.slice(-9, -6) + 'B';
  return insertThousands(num.slice(0, -12)) + 'T';
}

export function insertThousands(num: number | bigint | string) {
  num = num.toString();
  let i = num.length - 3, out = '';
  for (; i > 0; i -= 3) {
    out = ',' + num.slice(i, i + 3) + out;
  }
  out = num.slice(0, i + 3) + out;
  return out;
}

export const getBech32Prefix = (addr: string) => addr.split('1')[0];

export function shortaddr(addr: string) {
  if (!/^[a-z]+1/.test(addr)) return addr;
  const prefix = getBech32Prefix(addr);
  const remain = addr.slice(prefix.length);
  return prefix + remain.slice(0, 6) + '...' + remain.slice(-6);
}
