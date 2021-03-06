
/*
 *	Purejavascript Call function
 *
 *	Example:
 *
 *	Call( "https://chart.googleapis.com/chart", ["cht":"qr","chs":"300x300", "chl=MyQRCode"], my_response_handler );
 *
 *	Now handles timeouts by recalling timed out calls.
 *
 *  If the endpoint is not specified, Call breaks the fourth wall by calling Resolve() to find the configured API server.
 */

function Call( endpoint, parameters, custom_handler )
{
	var command = Call.EncodeToString( parameters );
	var handler = (custom_handler) ? custom_handler : Call.DoNothing;

	if ( "http" != endpoint.substr( 0, 4 ) )
	{
		endpoint = Resolve() + endpoint;
	}

	Call.Post( endpoint, command, handler, 0, 0 );
}

Call.Post
=
function ( endpoint, command, handler, timeout, timeouts )
{
	var httpRequest = Call.CreateXMLHttpRequest( endpoint, command, handler, timeout, timeouts );
		httpRequest.send( command );
}

Call.CreateXMLHttpRequest
=
function( endpoint, command, handler, timeout, timeouts )
{
	var httpRequest = new XMLHttpRequest();
		httpRequest.open( "POST", endpoint, true );
		httpRequest.withCredentials   = true;
		httpRequest.timeout           = timeout;
		httpRequest.timeouts          = timeouts;
		httpRequest.myEndpoint        = endpoint;
		httpRequest.myCommand         = command;
		httpRequest.myResponseHandler = handler;

		httpRequest.onreadystatechange
		=
		function()
		{
			Call.OnReadyStateChange( httpRequest, endpoint, handler );
		}

		httpRequest.ontimeout
		=
		function()
		{
			if ( 10 < timeouts )
			{
				alert( "Giving up! Connections to the API server have timed out " + timeouts + " times." );
			}
			else
			if ( 3 < timeouts )
			{
				alert( "Warning! Connections to the API server have timed out several times. Will keep trying, but now might be a good time to check the quality of your Internet connection." );

				Call.Post( endpoint, command, handler, timeout * 2, timeouts + 1 );
			}
			else
			{
				Call.Post( endpoint, command, handler, timeout * 2, timeouts + 1 );
			}
		}

		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

	return httpRequest;
}

Call.OnReadyStateChange
=
function( self, endpoint, handler )
{
	var status = self.status;

	switch ( self.readyState )
	{
	case 0:
	case 1:
	case 2:
	case 3:
		break;
		
	case 4:
		switch ( self.status )
		{
		case 200:
			console.log( "Called: " + endpoint );
			handler( self.responseText );
			break;

		case 404:
			console.log( "Invalid API endpoint: " + endpoint );
			break;

		case 501:
			console.log( "Required SQL Stored Procedure Not Implemented" );
			break;

		case 503:
			console.log( "Sorry, the API server is currently unavailable. Please try again later. (503)" );
			break;

		case 0:
			console.log( "The network timed out... (0)" );
			break;
			
		default:
			console.log( "Got status: " + status );
		}
		break;
		
	default:
		console.log( "Unexpected httpRequest ready state: " + self.readyState );
	}
}

Call.EncodeToString
=
function( parameters )
{
	var string = "";
	var sep    = "";

	for ( member in parameters )
	{
		if ( "" != member )
		{
			string += sep;
			string += member;
			string += "=";
			string += parameters[member];

			sep = "&";
		}
	}
	return string;
}

Call.DoNothing
=
function ()
{}









