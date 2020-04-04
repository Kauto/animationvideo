export default function toArray(value)	{
	return (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]);
}