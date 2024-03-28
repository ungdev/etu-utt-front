import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';

export function useStateWithReference<T>(initialValue: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  ref.current = value;
  return [value, setValue, ref];
}

export function useForceUpdate() {
  const [, setValue] = useState(false);
  return () => setValue((value) => !value);
}
