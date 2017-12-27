
function Selects( resolver )
{
	Selects.resolver = resolver;
	Selects.setup();
}

Selects.setup
=
function()
{
	var kinds = Array();
	var selects = document.getElementsByTagName( "SELECT" );
	if ( selects )
	{
		var n = selects.length;
		
		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
				select.setValue = Selects.setValue;

			var id   = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind = select.getAttribute( "data-kind" );

			if ( kind )
			{
				var cupid = id + kind;

				kinds.push( cupid );
			}
		}
	}

	if ( kinds.length )
	{
		Selects.Multiselect( Selects.ArrayToString( kinds ), "", Selects.setup.handler );
	}
}

Selects.setup.handler
=
function( responseText )
{
	var obj = JSON.parse( responseText );
	if ( obj && obj.results )
	{
		var lists = Array();
		var n = obj.results.length;
			
		for ( var i=0; i < n; i++ )
		{
			var list   = obj.results[i];
			var name   = list.name;
			var tuples = list.tuples;
			
			lists[name] = tuples;
		}
		Selects.setup.init( lists );
	}
}

Selects.setup.init
=
function( lists )
{
	var selects = document.getElementsByTagName( "SELECT" );

	if ( selects )
	{
		var n = selects.length;
		
		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
			var id     = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind   = select.getAttribute( "data-kind" );
			
			if ( kind && lists.hasOwnProperty( id + kind ) )
			{
				Selects.setup.addOptions( select, lists );
			}
		}

		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
			var id     = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind   = select.getAttribute( "data-kind" );
			
			if ( kind && lists.hasOwnProperty( id + kind ) )
			{
				if ( select.hasAttribute( "data-cascade" ) )
				{
					select.addEventListener( "change", Selects.Cascade );

					if ( select.hasAttribute( "data-value" ) )
					{
						Selects.DoCascade( select );
					}
				}
			}
		}
	}
}

Selects.setup.addOptions
=
function( select, lists )
{
	var id           = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
	var kind         = select.getAttribute( "data-kind" );
	var type         = select.getAttribute( "data-select-type" );
	var tuples       = lists[id + kind];
	
	if ( tuples )
	{
		select.options.length = 0;

		var offset   = 0;
		var selected = 0;
		var label    = select.getAttribute( "data-label"  ) ? select.getAttribute( "data-label"  ) : select.getAttribute( "placeholder" );
		if ( label )
		{
			select.options[0] = new Option( label, '' );
			offset++;
		}

		//if ( ! select.disabled )
		{
			var data_value = select.getAttribute( "data-value" );
			var data_text  = select.getAttribute( "data-text"  );

			var n = tuples.length;
			for ( var i=0; i < n; i++ )
			{
				var disabled = false;
				var name     = tuples[i].name;
				var text     = DecodeHTMLEntities( tuples[i].text );
					text     = text ? text : "";

				if ( 0 == name.indexOf( "!" ) )
				{
					disabled = true;
					name = name.substring( 1 );
				}

				if ( name == data_value               ) selected = i+offset;
				if ( -1 !== text.indexOf( data_text ) ) selected = i+offset;

				if ( name != text )
				{
					select.options[i+offset] = new Option( text, name );
				}
				else
				{
					select.options[i+offset] = new Option( text );
				}
				select.options[i+offset].disabled = disabled;
			}

			select.selectedIndex = selected;
		}
		
		if ( ("progressive" == type) && (0 < selected) )
		{
			for ( var i=selected - 1; i >= 0; i-- )
			{
				select.options[i].disabled = true;
			}
		}
	}
}

Selects.lookupOptions
=
function( id, kind, value )
{
	var select = document.getElementById( id );
	
	if ( select )
	{
		var n = select.length;

		if ( 0 < n )
		{
			for ( var i=0; i < n; i++ )
			{
				if ( select.options[i].value == value )
				{
					select.selectedIndex = i;
					break;
				}
			}
		}
		else
		{
			select.setAttribute( "data-value", value );
		}
	}
}

Selects.Cascade
=
function( event )
{
	Selects.DoCascade( event.target );
}

Selects.DoCascade
=
function( select )
{
	var value   = select.value;
	var targets = select.getAttribute( "data-cascade" );

	if ( targets )
	{
		var bits    = targets.split( "," );
		var n       = bits.length;
		
		for ( var i=0; i < n; i++ )
		{
			var target = bits[i];
			
			if ( target )
			{
				Selects.Reload( target, value );
			}
		}
		
		select.addEventListener( "change", Selects.Cascade );
		//select.onchange = Selects.Cascade;
	}
}

Selects.Reload
=
function( target, value )
{
	var select = document.getElementById( target );
	if ( select )
	{
		if ( "SELECT" == select.tagName )
		{
			var kind = select.getAttribute( "data-kind" );
			
			Selects.Multiselect( target + ":" + kind, value, Selects.setup.handler );

			//if ( value ) select.disabled = false;
		}
		else
		{
			if ( select.reload )
			{
				select.reload( value );
			}
		}
	}
}

Selects.Multiselect
=
function( kinds, value, handler )
{
	var parameters = new Object;
		parameters.kinds  = kinds;
		parameters.filter = value;

	var api_host = Selects.resolver();

	Call( api_host + "/api/multiselect/", parameters, handler );
}

Selects.SetValue
=
function( id, value )
{
	var select = document.getElementById( id );

	select.setValue( value );
	
//	if ( select )
//	{
//		var n = select.length;
//
//		if ( 0 < n )
//		{
//			for ( var i=0; i < n; i++ )
//			{
//				if ( select.options[i].value == value )
//				{
//					select.selectedIndex = i;
//					break;
//				}
//			}
//		}
//		else
//		{
//			select.setAttribute( "data-value", value );
//		}
//	}
}

Selects.setValue
=
function( value )
{
	if ( this )
	{
		var n = this.length;

		if ( 0 < n )
		{
			for ( var i=0; i < n; i++ )
			{
				if ( this.options[i].value == value )
				{
					this.selectedIndex = i;
					break;
				}
			}

			Selects.DoCascade( this );
		}
		else
		{
			this.setAttribute( "data-value", value );
		}
	}
}

Selects.ArrayToString
=
function( array )
{
	var string = "";
	var sep    = "";

	for ( var i in array )
	{
		string += sep + array[i];
		sep = ",";
	}
	
	return string;
}
