export {};

declare global {
  interface ObjectConstructor {
    keys<T>(o: T): (keyof T)[];
    entries<T>(o: T): [keyof T, T[keyof T]][];
  }
}
