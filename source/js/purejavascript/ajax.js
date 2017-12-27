
purejavascript.call
=
function( command, callback )
{
	var asynchronous = (null != callback);

	var httpRequest = new XMLHttpRequest();
		httpRequest.open( "POST", "/api/index.php", asynchronous );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

	if ( asynchronous )
	{
		httpRequest.onreadystatechange
		=
		function()
		{
			if ( (4 == httpRequest.readyState) && (200 == httpRequest.status) )
			{
				if ( callback )
				{
					callback( httpRequest.responseText );
				}
			}
		}
		httpRequest.send( command );
	}
	else
	{
		httpRequest.send( command );
	}
}

purejavascript.post
=
function( $command )
{
	var httpRequest = new XMLHttpRequest();
	    httpRequest.open( "POST", "/api/index.php", false );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	    httpRequest.send( $command );

	return httpRequest.responseText;
}

purejavascript.postToServer
=
function( $command, $server )
{
	var httpRequest = new XMLHttpRequest();
	    httpRequest.open( "POST", "http://api.ds.local/api/index.php", false );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	    httpRequest.send( $command );

	return httpRequest.responseText;
}

purejavascript.apicall
=
function( $command )
{
	var httpRequest = new XMLHttpRequest();
	    httpRequest.open( "GET", "/api/index.php?" + $command, false );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	    httpRequest.send();

	return httpRequest.responseText;
}

//purejavascript.call_if_complete
//=
//function( form, command )
//{
//	var target = form.getAttribute( "data-target" );
//	if ( target )
//	{
//		sm_Form_isComplete( form, target );
//	}
//
//	authentic.call( command );
//}
