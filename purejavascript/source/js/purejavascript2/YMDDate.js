
function YMDDate( date_string )
{
	var ymd_date = null;
	var ymd      = new Array();

	date_string = date_string.replace( /%2F/g, "/" );
	
	if ( -1 !== date_string.indexOf( "/" ) )
	{
		var parts = date_string.split( "/" );
		
		switch ( parts.length )
		{
		case 3:
			ymd[0] = (2 == parts[2].length) ? "20" + parts[2] : parts[2];
			ymd[1] = parts[1];
			ymd[2] = parts[0];
			break;
			
		case 2:
			ymd[0] = new Date().getFullYear();
			ymd[1] = parts[1];
			ymd[2] = parts[0];
		}
	}
	else
	if ( -1 !== date_string.indexOf( "-" ) )
	{
		ymd = date_string.split( "-" );
	}
	
	if ( 3 == ymd.length )
	{
		if ( (3 == ymd.length) && (4 == ymd[0].length) && (2 == ymd[1].length) && (2 == ymd[2].length) )
		{
			var year  = parseInt( ymd[0] );
			var month = parseInt( ymd[1] );
			var day   = parseInt( ymd[2] );

			if ( YMDDate.IsMonth( month ) && YMDDate.IsDayOfMonth( day, month ) )
			{
				ymd_date = ymd.join( '-' );
			}
		}
	}
	
	return ymd_date;
}

YMDDate.IsMonth
=
function( month )
{
	return (1 <= month) && (month <= 12);
}

YMDDate.IsDayOfMonth
=
function( day, month )
{
	switch ( month )
	{
	case 1:
	case 3:
	case 5:
	case 7:
	case 8:
	case 10:
	case 12:
		return (1 <= day) && (day <= 31);

	case 4:
	case 6:
	case 9:
	case 11:
		return (1 <= day) && (day <= 30);

	case 2:
		return (1 <= day) && (day <= 29);

	default:
		return false;
	}
}