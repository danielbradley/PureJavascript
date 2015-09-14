
purejavascript.togglebodyclass = {}

purejavascript.setup.togglebodyclass
=
function()
{
	var links = document.getElementsByTagName( "a" );
	var n     = links.length;
	
	for ( var i=0; i < n; i++ )
	{
		var anchor = links[i];
		
		if ( "togglebodyclass" == anchor.getAttribute( "data-action" ) )
		{
			anchor.addEventListener( "click", purejavascript.togglebodyclass.onClick, false );
		}
	}
}

purejavascript.togglebodyclass.onClick
=
function( event )
{
	var cls = this.getAttribute( "data-class" );

	if ( purejavascript.hasClass( document.body, cls ) )
	{
		purejavascript.removeClass( document.body, cls );
	}
	else
	{
		purejavascript.addClass( document.body, cls );
	}
	return false;
}
