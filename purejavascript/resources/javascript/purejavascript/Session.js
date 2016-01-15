
Session
=
function ( Redirect )
{
	Session.Redirect = Redirect;

	Call( "/auth/session/", new Array(), Session.Switch );
}

Session.Switch
=
function( responseText )
{
	Session.Handler( responseText );

	if ( Session.Redirect )
	{
		Session.Redirect();
	}
}

Session.Handler
=
function ( responseText )
{
	var idtype = "";

	Session.idtype = "";

	if ( -1 != responseText.indexOf( "UNAUTHENTICATED" ) )
	{
		Session.status = "UNAUTHENTICATED";
	}
	else
	if ( -1 != responseText.indexOf( "INVALID_SESSION" ) )
	{
		Session.status = "INVALID_SESSION";
	}
	else
	if ( "" != responseText )
	{
		var obj = JSON.parse( responseText );
		if ( obj && obj.sessionid )
		{
			Session.USER        = obj.USER;
			Session.email       = obj.email;
			Session.sessionid   = obj.sessionid;
			Session.idtype      = obj.idtype;
			Session.given_name  = obj.given_name;
			Session.family_name = obj.family_name;
			Session.user_hash   = obj.user_hash;
			Session.read_only   = obj.read_only;
			Session.status      = "AUTHENTICATED";

			idtype = Session.idtype;
		}
		else
		if ( obj && obj.error )
		{
			Session.status = obj["error"];
		}
	}

	//Redirect( idtype );
}
