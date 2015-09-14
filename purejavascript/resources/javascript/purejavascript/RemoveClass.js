
function RemoveClass( e, className )
{
	if ( RemoveClass.Contains( e, className ) )
	{
		e.className = RemoveClass.Remove( e.className, className );
	}
}

RemoveClass.Remove
=
function( hay, needle )
{
	var ret = hay.replace( needle, "" ).trim();

	while ( -1 != ret.indexOf( "  " ) )
	{
		ret = ret.replace( "  ", " " );
	}
	
	return ret;
}

RemoveClass.Contains
=
function( e, className )
{
	//
	//	AddClass.Contains( { className="cls active" }, "active' );
	//
	//	var st = 10 - 6;
	//
	//	0123456789
	//	cls active
	//	01234

	var contains = false;

	if ( e.className )
	{
		var st = (e.className.length - className.length) - 1;

		if ( className == e.className )
		{
			contains = true;
		}
		else
		if ( 0 <= st )
		{
			if ( -1 != e.className.indexOf( " " + className + " " ) )
			{
				contains = true;
			}
			else
			if ( 0 == e.className.indexOf( className + " " ) )
			{
				contains = true;
			}
			else
			if ( st == e.className.indexOf( " " + className ) )
			{
				contains = true;
			}
		}
	}
	return contains;
}
