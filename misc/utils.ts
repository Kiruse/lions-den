import type { FirestoreDate } from './types'

export const isFirestoreDate = (date: any): date is FirestoreDate => date && typeof date === 'object' && typeof date.seconds === 'number' && typeof date.nanoseconds === 'number';
export const fromFirestoreDate = (date: FirestoreDate) => new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
