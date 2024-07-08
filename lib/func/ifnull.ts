export default function ifNull<T>(
  value: T | null | undefined,
  alternative: T,
): T {
  return value === undefined || value === null || value === ""
    ? alternative
    : value;
}
