export default function ifNull(value, alternative)	{
	return (typeof(value) === "undefined" || value === null || value === "" ? alternative : value);
}