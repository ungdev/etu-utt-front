import { ForwardedRef, ReactElement, RefAttributes } from 'react';

declare global {
  interface ObjectConstructor {
    keys<T>(o: T): (keyof T)[];
    entries<T>(o: T): [keyof T, T[keyof T]][];
  }
  interface String {
    latinize(): string;
  }
}
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref#answer-58473012
declare module 'react' {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
