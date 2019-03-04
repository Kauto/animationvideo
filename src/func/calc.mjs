export default function calc(c, ...params) {
	return typeof(c) === "function" ? c.apply(null,params) : c;
}