/*
 *  PureJavacript, Is.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Is        = {}
Is.Date   = IsDate
Is.Prefix = IsPrefix

function IsDate( $datetime )
{
	var is_date = false;

	switch ( $datetime )
	{
	case null:
	case "NULL":
	case "null":
	case "":
	case "0":
	case "0000-00-00":
	case "0000-00-00 00:00:00":
		break;
		
	default:
		is_date = true;
	}

	return is_date;
}

function IsPrefix( string, prefix )
{
	return (0 == string.indexOf( prefix ));
}

