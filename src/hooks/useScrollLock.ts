// src/hooks/useScrollLock.ts
import { useEffect } from 'react';

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [locked]);
}
