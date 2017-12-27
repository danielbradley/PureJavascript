
function GetTuple( obj )
{
	var tuple = null;

	if ( obj instanceof Array )
	{
		for ( index in obj )
		{
			tuple = GetTuple( obj[index] );
			break;
		}
	}
	else
	{
		tuple = obj;
	}

	return tuple;
}
