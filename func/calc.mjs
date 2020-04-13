export default function calc(c, obj = null, ...params) {
  return typeof c === "function" ? c.apply(obj, params) : c;
}
