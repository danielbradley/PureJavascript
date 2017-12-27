
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