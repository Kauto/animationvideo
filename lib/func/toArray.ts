export default function toArray<T>(value: T | T[]): T[] {
  return value === undefined || value === null
    ? []
    : Array.isArray(value)
      ? value
      : [value];
}
