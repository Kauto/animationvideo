export type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export type OrFunction<R, P extends unknown[] = []> = R | ((...args: P) => R);
export type OrPromise<T> = T | Promise<T>;
export type ValueOf<T> = T[keyof T];
