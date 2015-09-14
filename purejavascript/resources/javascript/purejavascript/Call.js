
/*	Purejavascript Call function
 *
 *
 *
 *
 */

function Call( location, parameters, handler )
{
	var command = purejavascript.call.EncodeToString( parameters );

	if ( "http" != location.substr( 0, 4 ) )
	{
		location = Resolve() + location;
	}

	purejavascript.call.Post( location, command, handler, purejavascript.call.DoNothing );
}

purejavascript.call = {}

purejavascript.call.EncodeToString
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

purejavascript.call.DoNothing
=
function ()
{}

purejavascript.call.Post
=
function ( location, command, handler, default_handler )
{
	var response_handler = (handler) ? handler : default_handler;
	
	var httpRequest = new XMLHttpRequest();
		httpRequest.open( "POST", location, true );
		httpRequest.withCredentials = true;
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
		httpRequest.onreadystatechange
		=
		function()
		{
			var status = httpRequest.status;
		
			switch ( httpRequest.readyState )
			{
			case 0:
			case 1:
			case 2:
			case 3:
				break;
				
			case 4:
				switch ( httpRequest.status )
				{
				case 200:
					console.log( "Called: " + location );
					response_handler( httpRequest.responseText );
					break;

				case 404:
					console.log( "Invalid API endpoint: " + location );
					break;

				case 501:
					console.log( "Required SQL Stored Procedure Not Implemented" );
					break;

				case 503:
				case 0:
					console.log( "Sorry, the API server is currently unavailable. Please try again later." );
					break;
					
				default:
					console.log( "Got status: " + status );
				}
				break;
				
			default:
				console.log( "Unexpected httpRequest ready state: " + httpRequest.readyState );
			}
		}
        httpRequest.send( command );
}











































