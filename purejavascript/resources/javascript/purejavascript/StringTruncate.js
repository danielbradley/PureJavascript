
function StringTruncate( text, max_length )
{
	if ( text.length > max_length )
	{
		text = text.substring( 0, max_length - 3 ) + "...";
	}
	return text;
}
