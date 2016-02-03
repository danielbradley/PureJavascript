
function GetSearchValues()
{
	var object = new Object;
	
	var bits = window.location.search.substring( 1 ).split( "&" );
	var n    = bits.length;
	
	for ( var i=0; i < n; i++ )
	{
		var keyvalue = bits[i].split( "=" );
		var key      = decodeURIComponent( keyvalue[0] );
		var value    = decodeURIComponent( keyvalue[1] );
	
		object[key] = value;
	}
	return object;
}

function GetSearchValue( name )
{
	var parameters = GetSearchValues();
	
	return parameters[name] ? parameters[name] : "";
}
