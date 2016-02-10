
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
				var text     = tuples[i].text;
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
    // purejavascript.selects.Reload
    // Reloads valid options into a SELECT control by calling the server Multiselect API with filtering
    //  parameters gathered from one (or more) elements.
    
    // Legacy behaviour is to assume only one value is needed by the dependent SELECT,
    //  and that this filter value for the dependent SELECT is the new value just chosen
    //  in the triggering SELECT control which has been conveniently passed in by DoCascade as the 'value' parameter.
    // In most cases that behaviour is sufficient.
    
    // Newer proposed behaviour makes the 2nd value parameter unnecessary because a filter function can be defined
    //  to generate the filter parameter using any means available on the page, such as multiple form field values.
    //  This function is defined by an HTML "data-filter" attribute on the dependent SELECT which should be
    //  a simple variable reference to a named function which will be given the parameters
    //          (target, value)
    //  where
    //          target  = the id string of the select element being reloaded.
    //          value   = the new value selected in the control triggering the reload.
    
	var select = document.getElementById( target );
	if ( select )
	{
		var kind = select.getAttribute( "data-kind" );
        var fval = value;
        
        //Check if a filter value gathering function is defined.
        //This should not be done inside DoCascade because the purpose of DoCascade is
        // only to trigger refreshes of dependent controls. DoCascade does not know which other values each affected
        // control will need to gather in order to call its own particular option-builder API.
        var filter =  select.getAttribute( "data-filter" );
        if (filter!=null) {
            var filterFun = null;
            //expect simple variable name containing a custom function.
            var funnameRE = new RegExp("^ *[\\w.$_]+ *$");
            if ( (typeof filter)=="string" && funnameRE.test(filter) ) {
                filterFun = eval(filter);
            }
            if (filterFun) fval = filterFun(target,value);
        }

        //Always check if any object encoding is needed on the filter parameter, such as multiple fields from a filter function,
        // however a simple string value will always be untouched. If the value from the filter function has already been serialised
        // in some manner specific to that API then it will be preserved. In all other cases a generic encoding is done automatically.
        var fstring = purejavascript.selects.FilterEncoder(fval);
        
		purejavascript.selects.Multiselect( target + ":" + kind, fstring, purejavascript.selects.setup.handler );

		//if ( value ) select.disabled = false;
	}
}


// convenience function.
purejavascript.selects.isArray
=
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}


/** For encoding one or more parameter values into a single string that can be passed into the generic Multiselect filter apparatus.
 *  A single string will be returned unaltered.  i.e. "x x"
 *  An object with named properties will be encoded the same as the query parameters portion of a URI. i.e. "a=x%20x&b=yy"
 *  An array of values will be encoded as pipe-delimited string. i.e. "xx|yy"
 *  Example data:
 *      purejavascript.selects.FilterEncoder( {foo:"bar", moo:"Mars' M&Ms x 240g"} )
 *          == "foo=bar&moo=Mars'%20M%26Ms%20x%20240g"
 *      purejavascript.selects.FilterEncoder( ["bar", "Mars' M&Ms x 240g"] )
 *          == "bar|Mars' M&Ms x 240g"
 */
purejavascript.selects.FilterEncoder
=
function( fval ) {
    var argType = typeof fval;
    var answer=null;
    
    if ( argType=="string" ) {
        //Assume only a single string is expected by the function.
        answer = fval;
    } else if (argType=="object") {
        if ( purejavascript.selects.isArray(fval) ) {
            //Assume positional parameters, encode in pipe-delimited format.
            for (var i in fval) {
                if (answer==null) answer = "" + fval[i];
                else answer = answer + "|" + fval[i];
            }
        } else {
            //Assume named parameters, encode in URI query parameter syntax.
            answer = '';
            for (var name in fval) {
                if (answer==null) answer = "";
                else answer = answer + "&"
                answer = answer + encodeURIComponent(name) + "=" + encodeURIComponent( fval[name] );
            }
        }
    } else throw "Unrecognised type passed to FilterEncoder as filter value";
    return answer;
}



purejavascript.selects.Multiselect
=
function( kinds, value, handler )
{
    //The Multiselect function is supposed to be a 1:1 match for the corresponding API or stored procedure which needs atomic values,
    // so for consistency a multi-condition filter should be serialised to a single parameter before passing it to Multiselect.
    
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
