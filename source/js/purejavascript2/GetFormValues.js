
function GetFormValues( form )
{
	var object = new Object;

	if ( form && form.elements )
	{
		var n = form.elements.length;

		for ( var i=0; i < n; i++ )
		{
			var e     = form.elements[i];
			var key   = e.name;
			var value = e.value;

			switch ( e.type )
			{
			case "checkbox":
				if ( ! e.disabled && e.checked )
				{
					value = e.checked ? value : "";
				}
                else
                {
                    value = "";
                }
				break;

			case "radio":
				var v = encodeURIComponent( value );
				if ( ! e.checked )
				{
					key   = null;
					value = null;

					object[v] = 0;
				}
				else
				{
					object[v] = 1;
				}
				break;

			case "hidden":
				if ( "" != e.hasAttribute( "data-table" ) )
				{
					value = GetFormValues.ConvertTableToJSON( e.getAttribute( "data-table" ) );
				}
				break;
			}

			switch ( e.tagName )
			{
			case "BUTTON":
				value = e.innerHTML.trim();
				break;
			}
			
			if ( key && value )
			{
				if ( GetFormValues.IsTimeComponent( key ) )
				{
					key   = GetFormValues.GetTimePrefix( key );
					value = GetFormValues.ExtractTime( form, key );
				}
			
				if ( object[key] )
				{
					object[key] += ("," + encodeURIComponent( value ));
				}
				else
				{
					object[key] = encodeURIComponent( value );
				}
			}
		}
	}
	else
	{
		console.log( "GetFormValues: null form passed!" );
	}
	return object;
}

GetFormValues.ConvertTableToJSON
=
function( table_id )
{
	var tuples = new Array();
	var table = document.getElementById( table_id );

	if ( table )
	{
		var rows   = table.getElementsByTagName( "TR" );
		var n      = rows.length;
		
		for ( var i=0; i < n; i++ )
		{
			var tuple = new Object();
			var row   = rows[i];
			
			var fields = row.getElementsByTagName( "TD" );
			var m      = fields.length;
		
			for ( var j=0; j < m; j++ )
			{
				var field = fields[j];

				if ( field.hasAttribute( "data-name" ) )
				{
					var key   = field.getAttribute( "data-name" );
					var value = field.innerHTML.trim();
					
					tuple[key] = value;
				}
			}
			
			tuples.push( tuple );
		}
	}
	
	return JSON.stringify( tuples );
}

GetFormValues.IsTimeComponent
=
function( name )
{
	return (-1 !== name.indexOf( "_hour" ));
}

GetFormValues.GetTimePrefix
=
function( name )
{
	var index = name.indexOf( "_hour" );
	
	return name.substring( 0, index );
}

GetFormValues.ExtractTime
=
function( form, key )
{
	var ret         = "";
	var key_hour    = key + "_hour";
	var key_minutes = key + "_minutes";
	var key_seconds = key + "_seconds";

	if ( form.elements[key_hour] )
	{
		ret += form.elements[key_hour].value;
	}

	if ( form.elements[key_minutes] )
	{
		ret += (":" + form.elements[key_minutes].value);
	}

	if ( form.elements[key_seconds] )
	{
		ret += (":" + form.elements[key_seconds].value);
	}

	return ret;
}
