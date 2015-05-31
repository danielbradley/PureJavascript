
function SetCookie( path, cname, cvalue, exdays )
{
    var d       = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
	var cookie  = cname + "=" + cvalue + "; " + expires + "; " + "path=" + path + ";";
	
    document.cookie = cookie;
}
