/**
 * Returns a string representing the next higher folder relative to the first parameter, as either a full HREF or only the document path portion depending on what is passed as the first parameter. 
 * Pass window.location.pathname for backwards compatibility with the old Up, as described in Up_Old.
 * Pass window.location to get new query-scrubbing behaviour as described in UpHref.
 * The qparams argument is only used with the full Href version of the function.
 */
function Up( location, qparams ) {
    if ((typeof location) == "object") return UpHref(location, qparams);
    else return Up_Old(location);
}


/**
 * Returns a complete href for the next higher folder of the given URL.
 * There is the option to preserve the values of specific query parameters in the new URL. The result of Up is assignable to location.href.
 *
 * @param location  the window.location object.
 * @param preserveQueryParams  A case-sensitive array of query parameters which will be preserved in the new URL. When Null, all query parameters are preserved. When an empty array, all query parameters are discarded. When set to a  non-empty list of parameter names, only parameters with those exact names will have their values preserved in the new href.
 */
function UpHref( location, preserveQueryParams )
{
	var ret = "";
    var pathname = location.pathname;
    
	var docPortion  = "";
	var bits = pathname.split( "/" );
	var n    = bits.length;
	
	for ( var i=0; i < (n-2); i++ )
	{
		docPortion += bits[i] + "/";
	}
    
    var qPortion="";
    var qLen = (location.search||'').length;
    if (qLen>1) {
        var query = location.search.substring(1);
        if (preserveQueryParams==null) {
            qPortion = "?" + query; // Old nondestructive behaviour is the default if parameter is missing.
        } else if ( preserveQueryParams.length==0 ) {
            qPortion="";
        } else {
            var params = query.split('&');
            qPortion = "?";
            var passedCount = 0;
            for (var _pix in params) {
                var parm = params[_pix];
                var actualName = parm.substring(0, parm.indexOf('='));
                if (preserveQueryParams.indexOf(actualName)>=0) {
                    if (passedCount>0) qPortion += '&';
                    qPortion += parm;
                    passedCount++;
                }
            }
        }
    }
    
    // construct full HREF
    ret = location.origin + docPortion + qPortion;
    return ret;
}

/** Trim the final folder from a location pathname to yield the path to next higher level folder.
 * The result is reassignable to location.pathname (the old behaviour of Up). The query parameters are
 * not available in the pathname component so the window.location object will preserve them in the new location.
 */
function Up_Old( pathname ) {
    var ret  = "";
    var bits = pathname.split( "/" );
    var n    = bits.length;

    for ( var i=0; i < (n-2); i++ )
    {
        ret += bits[i] + "/";
    }
    return ret;
}