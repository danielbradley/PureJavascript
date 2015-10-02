
function SetCookie( path, cname, cvalue, exdays )
{
    var d       = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
	var cookie  = cname + "=" + cvalue + "; " + expires + "; " + "path=/" + ";";
	
    document.cookie = cookie;
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
