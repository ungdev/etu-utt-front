import { useEffect, useState } from 'react';
import { LocalStorageNames } from '@/global';

export function useLocalStorageVariable(variable: LocalStorageNames): string | null | undefined {
  const [value, setValue] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const listener = () => {
      if (typeof localStorage === 'undefined') return;
      setValue(localStorage.getItem(variable));
    };
    document.addEventListener('DOMContentLoaded', listener);
    return () => document.removeEventListener('DOMContentLoaded', listener);
  }, []);
  return value;
}
