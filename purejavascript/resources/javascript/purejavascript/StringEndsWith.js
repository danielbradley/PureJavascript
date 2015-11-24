
function StringEndsWith( string, suffix )
{
	var n = string.length;
	var s = suffix.length;
	var i = string.indexOf( suffix );

	return (i == (n - s));
}
