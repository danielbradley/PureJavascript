/*
 *  PureJavacript, Auth.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

Auth                 = {}
Auth.Login           = Auth_Login;
Auth.Logout          = Auth_Logout;
Auth.LogoutAndReload = Auth_LogoutAndReload;

function Auth_Login( event )
{
	Submit( event, Auth.Login.Handler );
}

function Auth_Logout( event )
{
	Auth.UnsetIDTypeCookie();
	Auth.UnsetSessionIDTypeCookie();
	Auth.UnsetCookie( "email" );

	Call( "/auth/logout/", new Array(), Auth.Logout.Handler );
}

function Auth_LogoutAndReload()
{
	Auth.UnsetIDTypeCookie();
	Auth.UnsetSessionIDTypeCookie();
	Auth.UnsetCookie( "email" );

	Call( "/auth/logout/", new Array(), Auth.LogoutAndReload.Handler );
}

Auth.Login.Handler
=
function ( responseText )
{
	if ( "" != responseText )
	{
		var obj = JSON.parse( responseText );

		if ( obj && obj.idtype )
		{
			Auth.SetIDTypeCookie( obj.idtype );
			Auth.SetSessionIDTypeCookie( obj.sessionid );
			Auth.SetCookie( "email", obj.email, 1 );

			Redirect( obj.idtype ); // External Call
		}
		else
		{
			if ( obj["error"] == "INVALID_CREDENTIALS" )
			{
				var errorText = "Invalid username or password.";
			}
			else
			{
				var errorText = "Error logging in, please try again.";
			}

			var loginErrorDiv = document.getElementById( 'login-error' );

            if ( loginErrorDiv )
            {
				loginErrorDiv.innerHTML = "";
				loginErrorDiv.innerHTML = errorText;
            }
            else
            {
                alert( errorText );
            }
		}
	}
	else
	{
		Auth.Logout();
	}
}

Auth.Logout.Handler
=
function ( responseText )
{
	location.replace( location.protocol + "//" + location.hostname + "/" );
}

Auth.LogoutAndReload.Handler
=
function ( responseText )
{
	location.reload();
}

Auth.SetIDTypeCookie
=
function( idtype )
{
	Auth.SetCookie( "idtype", idtype, 1 );
}

Auth.SetSessionIDTypeCookie
=
function( sid )
{
	Auth.SetCookie( "sessionid", sid, 1 );
}

Auth.UnsetCookie
=
function ( cname )
{
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.UnsetIDTypeCookie
=
function ()
{
	document.cookie = "idtype=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.UnsetSessionIDTypeCookie
=
function ()
{
	document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.SetCookie
=
function( cname, cvalue, exdays )
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/;";
}

