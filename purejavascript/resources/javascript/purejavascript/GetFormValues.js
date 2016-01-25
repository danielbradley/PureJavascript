
function GetFormValues( form )
{
	var object = new Object;

	if ( form && form.elements )
	{
		var n      = form.elements.length;

		for ( var i=0; i < n; i++ )
		{
			var e     = form.elements[i];
			var key   = e.name;
			var value = e.value;

			switch ( e.type )
			{
			case "checkbox":
				value = e.checked ? "1" : "0";
				break;

			case "radio":
				if ( ! e.checked )
				{
					key   = null;
					value = null;
				}
				break;

			case "hidden":
				if ( "" != e.hasAttribute( "data-table" ) )
				{
					value = GetFormValues.ConvertTableToJSON( e.getAttribute( "data-table" ) );
				}
				break;
			}
			
			if ( key && value )
			{
				object[key] = encodeURIComponent( value );
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
