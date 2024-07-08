export type WithoutFunction<R> = R extends Function ? never : R;
export default function calc<T = unknown, FunctionParamsType extends unknown[] = unknown[]>(c: T | ((...params: FunctionParamsType) => T), ...params: FunctionParamsType): T;
export declare function calcB<T = unknown, OBJ = unknown, FunctionParamsType extends unknown[] = unknown[]>(c: T | ((...params: FunctionParamsType) => T), bind: OBJ, ...params: FunctionParamsType): T;
