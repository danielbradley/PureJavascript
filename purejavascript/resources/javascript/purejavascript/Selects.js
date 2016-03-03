
function Selects( resolver )
{
	purejavascript.selects.resolver = resolver;
	purejavascript.selects.setup();
}

purejavascript.selects = {}

purejavascript.selects.setup
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
				select.setValue = purejavascript.selects.setValue;

			var id   = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind = select.getAttribute( "data-kind" );

			var cupid = id + kind;

			kinds.push( cupid );
		}
	}

	if ( kinds.length )
	{
		purejavascript.selects.Multiselect( purejavascript.selects.ArrayToString( kinds ), "", purejavascript.selects.setup.handler );
	}
}

purejavascript.selects.setup.handler
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
		purejavascript.selects.setup.init( lists );
	}
}

purejavascript.selects.setup.init
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
				purejavascript.selects.setup.addOptions( select, lists );
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
					select.addEventListener( "change", purejavascript.selects.Cascade );

					if ( select.hasAttribute( "data-value" ) )
					{
						purejavascript.selects.DoCascade( select );
					}
				}
			}
		}
	}
}

purejavascript.selects.setup.addOptions
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
				var name     = tuples[i].name;
				var text     = DecodeHTMLEntities( tuples[i].text );
				var disabled = false;

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

purejavascript.selects.lookupOptions
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

purejavascript.selects.Cascade
=
function( event )
{
	purejavascript.selects.DoCascade( event.target );
}

purejavascript.selects.DoCascade
=
function( select )
{
	var value   = select.value;
	var targets = select.getAttribute( "data-cascade" );
	var bits    = targets.split( "," );
	var n       = bits.length;
	
	for ( var i=0; i < n; i++ )
	{
		var target = bits[i];
		
		if ( target )
		{
			purejavascript.selects.Reload( target, value );
		}
	}
	
	select.addEventListener( "change", purejavascript.selects.Cascade );
	//select.onchange = purejavascript.selects.Cascade;
}

purejavascript.selects.Reload
=
function( target, value )
{
	var select = document.getElementById( target );
	if ( select )
	{
		var kind = select.getAttribute( "data-kind" );
		
		purejavascript.selects.Multiselect( target + ":" + kind, value, purejavascript.selects.setup.handler );

		//if ( value ) select.disabled = false;
	}
}

purejavascript.selects.Multiselect
=
function( kinds, value, handler )
{
	var parameters = new Object;
		parameters.kinds  = kinds;
		parameters.filter = value;

	var api_host = purejavascript.selects.resolver();

	Call( api_host + "/api/multiselect/", parameters, handler );
}

purejavascript.selects.SetValue
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

purejavascript.selects.setValue
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
		}
		else
		{
			this.setAttribute( "data-value", value );
		}
	}
}

purejavascript.selects.ArrayToString
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
