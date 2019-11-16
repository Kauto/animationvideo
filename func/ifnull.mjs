export default function ifNull(value, alternative)	{
	return (value === undefined || value === null || value === "" ? alternative : value);
}