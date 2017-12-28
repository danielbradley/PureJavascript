/*
 *  PureJavacript, String.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Strings = {}
Strings.EndsWith     = StringEndsWith
Strings.StartsWith   = StringStartsWith
Strings.StripUnicode = StringStripUnicode
Strings.Truncate     = StringTruncate

function StringEndsWith( string, suffix )
{
	var n = string.length;
	var s = suffix.length;
	var i = string.indexOf( suffix );

	return (i == (n - s));
}

function StringStartsWith( string, prefix )
{
    return (0 === string.indexOf( prefix ));
}

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

function StringTruncate( text, max_length )
{
	if ( text && (text.length > max_length) )
	{
		text = text.substring( 0, max_length - 3 ) + "...";
	}
	return text;
}

