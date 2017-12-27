
function Setup()
{
	Setup.Elements( document.getElementsByTagName( "DIV"   ) );
	Setup.Elements( document.getElementsByTagName( "FORM"  ) );
	Setup.Elements( document.getElementsByTagName( "TBODY" ) );
}

Setup.Elements
=
function( elements )
{
	var n = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var element    = elements[i];
		var parameters = GetSearchValues();

		Setup.Element( element, parameters );
	}
}

Setup.Element
=
function( element, parameters )
{
	if ( element && element.hasAttribute( "data-setup-url" ) )
	{
		var url        = element.getAttribute( "data-setup-url" );
		var handler    = Setup.DefaultHandler;

		if ( element.hasOwnProperty( "setup" ) )
		{
			handler = element.setup;

			handler = handler ? handler : element.handler;
		}

		if ( !parameters.target_id && element.hasAttribute( "id" ) )
		{
			parameters.target_id = element.getAttribute( "id" );
		}

		Call( Resolve() + url, parameters, handler );
	}
}

Setup.DefaultHandler
=
function( responseText )
{
	var json = JSON.parse( responseText );
	
	if ( "OK" != json.status )
	{
		console.log( responseText );
	}
}
