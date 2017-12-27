
function StringStripUnicode( s )
{
	var r = "";
	var l = "";
	var n = s.length;
	
	for ( var i=0; i < n; i++ )
	{
		try {
			if ( s.charCodeAt( i ) <= 255 )
			{
				r += s.charAt( i );
				l += "#";
			}
			else
			{
				l += "U";
			}
		}
		catch (err)
		{}
	}
	
	console.log( l );
	
	return r;
}
