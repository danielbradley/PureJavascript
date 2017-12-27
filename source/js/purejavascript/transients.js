
purejavascript.transients = {}

purejavascript.setup.transients
=
function()
{
	var links = document.getElementsByTagName( "div" );
	var n     = links.length;
	
	for ( var i=0; i < n; i++ )
	{
		var anchor = links[i];
		
		if ( "transients" == anchor.getAttribute( "data-action" ) )
		{
			anchor.addEventListener( "click", purejavascript.transients.onClick, false );
		}
		else
		if ( "transients_hide" == anchor.getAttribute( "data-action" ) )
		{
			anchor.addEventListener( "click", purejavascript.transients.hideTransient, false );
		}
	}
}

purejavascript.transients.onClick
=
function( event )
{
	var target = this.getAttribute( "data-target" );
	var value  = this.getAttribute( "data-value"  );
	var max    = this.getAttribute( "data-max"    );

	var n      = parseInt( max );

	var  t = document.getElementById( target );
	if ( t )
	{
		var current = t.getAttribute( "data-current" );
		var c       = parseInt( current );

		if ( "next" == value )
		{
			value = (c + 1 + n) % n;
		}
		else
		if ( "last" == value )
		{
			value = (c - 1 + n) % n;
		}
	
		purejavascript.removeClass( t, "display-transient" + current );
		purejavascript.addClass   ( t, "display-transient" + value   );

		t.setAttribute( "data-current", value );
	}
	return false;
}

purejavascript.transients.hideTransient
=
function( event )
{
	var target = this.getAttribute( "data-target" );
	var t      = document.getElementById( target );

	if ( t )
	{
		var current = t.getAttribute( "data-current" );
		var c       = parseInt( current );
		
		if ( NaN != c )
		{
			purejavascript.removeClass( t, "display-transient" + c );
		}
	}
}
