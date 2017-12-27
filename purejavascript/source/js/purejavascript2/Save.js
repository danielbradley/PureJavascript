
function Save( event, handler )
{
	var element     = event.target;
	var form        = event.target.form;
	var parameters  = GetFormValues( form );
	var url         = form.getAttribute( "data-change-url" );

	if ( ! parameters.hasOwnProperty( "USER" ) )
	{
	//	parameters.USER = Session.USER;
	}

	switch ( element.type )
	{
	case 'checkbox':
		parameters.name  = element.name;
		parameters.value = element.checked ? "1" : "0";
		break;
	
	case 'select-one':
	case 'text':
	default:
		parameters.name  = encodeURIComponent( element.name  );
		parameters.value = encodeURIComponent( element.value );
	}

	Call( Resolve() + url, parameters, handler ? handler : Save.Handler );
}

Save.Handler
=
function( responseText )
{
	console.log( responseText );
}
