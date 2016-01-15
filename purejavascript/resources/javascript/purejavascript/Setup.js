
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
		var element = elements[i];
		
		if ( element.hasAttribute( "data-setup-url" ) )
		{
			var url        = element.getAttribute( "data-setup-url" );
			var parameters = GetSearchValues();
			var handler    = Setup.DefaultHandler;

			if ( element.hasOwnProperty( "setup" ) )
			{
				handler = element.setup;

				handler = handler ? handler : element.handler;
			}

			Call( Resolve() + url, parameters, handler );
		}
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
