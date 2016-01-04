
function Submit( event, custom_handler )
{
	var form       = event.target;
	var apihost    = Resolve();
	var parameters = GetFormValues( form );
	var handler    = custom_handler ? custom_handler : purejavascript.SubmitDefaultHandler;

	if ( form && form.hasAttribute( "data-url" ) )
	{
		var url        = form.getAttribute( "data-url" );
		var parameters = GetFormValues( form );
		var handler    = form.handler ? form.handler : handler;

		Call( apihost + url, parameters, handler );
	}
	else
	if ( form.hasAttribute( "data-submit-url" ) )
	{
		var url        = form.getAttribute( "data-submit-url" );
		var parameters = GetFormValues( form );
		var handler    = form.handler ? form.handler : handler;

		Call( apihost + url, parameters, handler );
	}
	return false;
}

purejavascript.SubmitDefaultHandler
=
function( responseText )
{
	var json = JSON.parse( responseText );
	
	if ( "OK" == json.status )
	{
		var pathbits = location.pathname.split( "/" );
		var bit = "";
		
		do
		{
			bit = pathbits.pop();
		}
		while ( "" == bit );

		pathbits.push( "" );

		var pathname = location.protocol + "//" + location.hostname + pathbits.join( "/" );

		location.replace( pathname );
	}
}
