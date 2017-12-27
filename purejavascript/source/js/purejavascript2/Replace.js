
function Replace( text, array )
{
	for ( var member in array )
	{
		var key   = "%" + member + "%";
		var value = array[member];

		while ( -1 != text.indexOf( key ) )
		{
			text = text.replace( key, value );
		}
	}
	return text;
}
