
function Up( pathname )
{
	var ret  = "";
	var bits = pathname.split( "/" );
	var n    = bits.length;
	
	for ( var i=0; i < (n-2); i++ )
	{
		ret += bits[i] + "/";
	}
	
	return ret;
}
