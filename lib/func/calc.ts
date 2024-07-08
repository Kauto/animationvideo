// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type WithoutFunction<R> = R extends Function ? never : R;

export default function calc<
  T = unknown,
  FunctionParamsType extends unknown[] = unknown[],
>(
  c: T | ((...params: FunctionParamsType) => T),
  ...params: FunctionParamsType
): T {
  return typeof c === "function"
    ? (c as (...params: FunctionParamsType) => T)(...params)
    : c;
}
