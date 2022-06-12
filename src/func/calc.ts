export type WithoutFunction<R> = R extends Function ? never : R

export default function calc<
  T = unknown,
  FunctionParamsType extends any[] = any[],
  >(
    c: T | ((...params: FunctionParamsType) => T),
    ...params: FunctionParamsType): T {
  return typeof c === "function" ? (c as ((...params: FunctionParamsType) => T))(...params) : c;
}
