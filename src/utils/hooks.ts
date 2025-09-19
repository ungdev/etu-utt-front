import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { LocalStorageNames } from '@/global';

export function useStateWithReference<T>(initialValue: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  ref.current = value;
  return [value, setValue, ref];
}

export function useLocalStorageVariable(variable: LocalStorageNames): string | null | undefined {
  const [value, setValue] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    setValue(localStorage.getItem(variable));
  }, [typeof localStorage]);
  return value;
}
