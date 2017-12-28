/*
 *  PureJavacript, Cookie.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Cookie            = {}
Cookie.Get        = GetCookie
Cookie.Set        = SetCookie
Cookie.Unset      = UnsetCookie

function GetCookie( search )
{
    var key = "";
    var val = "";

    if ( "" != search )
    {
        var bits = document.cookie.split( ";" );
        var n    = bits.length;

        for ( var i=0; i < n; i++ )
        {
            var keyval = bits[i].split( "=" );

            if ( (2 == keyval.length) && (keyval[0].trim() == search) )
            {
                val = keyval[1].trim();
                break;
            }
        }
    }

    return val;
}

function SetCookie( path, cname, cvalue, exdays )
{
    var d       = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = (0 != exdays) ? "expires="+d.toUTCString() + ";" : "";
	var cookie  = cname + "=" + cvalue + "; " + expires + " " + "path=/" + ";";
	
    document.cookie = cookie;
}

function UnsetCookie( name )
{
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

function SetIDTypeCookie( idtype )
{
	SetCookie( "/", "idtype", idtype, 1 );
}

function SetSessionIDTypeCookie( sid )
{
	SetCookie( "/", "sessionid", sid, 1 );
}

function UnsetIDTypeCookie()
{
	document.cookie = "idtype=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

function UnsetSessionIDTypeCookie()
{
	document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

