/*
 *  PureJavacript, Helper.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

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

function LimitOffsetParameters( json )
{
	var parameters = null;
	var offset     = ("" != json.offset) ? parseInt( json.offset ) : 0;
	var limit      = ("" != json.limit ) ? parseInt( json.limit  ) : 0;
	
	if ( limit )
	{
		parameters        = new Object();
		parameters.limit  = limit;
		parameters.offset = limit + offset;
	}
	
	return parameters;
}

function Object_Get( $object, $member )
{
	if ( $object.hasOwnProperty( $member ) )
	{
		return decodeURI( $object[$member] );
	}
	else
	{
		return "";
	}
}

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

