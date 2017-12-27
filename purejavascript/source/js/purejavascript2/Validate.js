
function Validate( event, handler )
{
	var valid  = true;
	var form   = event.target;
	var n      = form.elements.length;

	form.checkValidity();
	
	for ( var i=0; i < n; i++ )
	{
		var element   = form.elements[i];

		if ( element.hasAttribute( "required" ) )
		{
			var name      = element.name;
			var value     = element.value;
			var validated = element.validity.valid;

			Validate.AddClass( element, "checked" );

			if ( false === validated )
			{
				valid = false;
			}
		}
	}

	if ( valid && handler )
	{
		handler( event );
	}
	else
	{
		alert( "Please complete the form before submitting." );
	}
	
	return false;
}

Validate.HasClass
=
function ( element, cls )
{
	var classes = element.className;
	
	return (-1 != classes.indexOf( cls ));
}

Validate.AddClass
=
function ( element, cls )
{
	if ( element && cls )
	{
		var classes = element.className;
		
		if ( -1 == classes.indexOf( cls ) )
		{
			element.className += (" " + cls);
		}
	}
}

Validate.RemoveClass
=
function ( element, cls )
{
	var classes = element.className;
	var f = 0;
	var n = cls.length;

	if ( (-1 != classes.indexOf( " " + cls )) || (-1 != classes.indexOf( cls + " " )) || (-1 != classes.indexOf( cls )) )
	{
		var f = classes.indexOf( cls );

		if ( (0 < f) && (' ' == classes[f - 1]) ) f--;
	
		element.className = classes.substring( 0, f ) + classes.substring( f + n + 1 );
	}
}

