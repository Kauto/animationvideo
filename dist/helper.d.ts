export declare type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;
export declare type OrFunction<R, P extends any[] = []> = R | ((...args: P) => R);
export declare type OrPromise<T> = T | Promise<T>;
export declare type ValueOf<T> = T[keyof T];
