import { useEffect } from 'react'

export default function useAsyncEffect(effect: () => Promise<void>, deps?: any[]) {
  useEffect(() => {
    effect();
  }, deps);
}
