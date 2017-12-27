
function Submit( event, custom_handler )
{
	var form       = event.target;
	var apihost    = Resolve();
	var handler    = custom_handler ? custom_handler : Submit.SubmitDefaultHandler;
	var parameters = GetFormValues( form );

	var submit     = form.elements['submit'];

	if ( submit && ("delete" == submit.value.toLowerCase()) )
	{
		if ( form && form.hasAttribute( "data-delete-url" ) )
		{
			var url     = form.getAttribute( "data-delete-url" );
			var handler = form.handler ? form.handler : handler;

			Call( apihost + url, parameters, handler );
		}
	}
	else
	if ( form && form.hasAttribute( "data-url" ) )
	{
		var url        = form.getAttribute( "data-url" );
		var handler    = form.handler ? form.handler : handler;

		Call( apihost + url, parameters, handler );
	}
	else
	if ( form.hasAttribute( "data-submit-url" ) )
	{
		var url        = form.getAttribute( "data-submit-url" );
		var handler    = form.handler ? form.handler : handler;

		Call( apihost + url, parameters, handler );
	}
	return false;
}

Submit.SubmitDefaultHandler
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
