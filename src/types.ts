export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
export type KeysOfUnion<T> = T extends T ? keyof T : never;
