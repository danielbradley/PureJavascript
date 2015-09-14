
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
			case "radio":
				value = e.checked ? "1" : "0";
				break;
			}
			
			if ( key && value )
			{
				object[key] = value;
			}
		}
	}
	else
	{
		console.log( "GetFormValues: null form passed!" );
	}
	return object;
}
