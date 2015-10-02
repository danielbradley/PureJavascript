
function Submit( event, handler )
{
	var form       = event.target;
	var apihost    = Resolve();
	var parameters = GetFormValues( form );

	if ( form && form.hasAttribute( "data-url" ) )
	{
		var url        = form.getAttribute( "data-url" );
		var parameters = GetFormValues( form );
		var handler    = form.handler ? form.handler : handler;

		Call( api_host + url, parameters, handler );
	}
	else
	if ( form.hasAttribute( "data-submit-url" ) )
	{
		var url        = form.getAttribute( "data-submit-url" );
		var parameters = GetFormValues( form );
		var handler    = form.handler ? form.handler : handler;

		Call( api_host + url, parameters, handler );
	}
	return false;
}
