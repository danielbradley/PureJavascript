
function AddClass( e, className )
{
	if ( ! AddClass.Contains( e, className ) )
	{
		if ( "" == e.className )
		{
			e.className = className;
		}
		else
		{
			e.className += " " + className;
		}
	}
}

AddClass.Contains
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
	return contains;
}
