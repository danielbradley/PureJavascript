
function WordLimit( elements )
{
	var n = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var e = elements[i];
	
		if ( ("TEXTAREA" == e.tagName) && e.hasAttribute( "data-limit" ) )
		{
			e.oninput  = WordLimit.OnInput;
		}
	}
}

WordLimit.OnInput
=
function( event )
{
	var textarea  = event.target;
	var limit     = textarea.getAttribute( "data-limit" );
	var target_id = textarea.getAttribute( "data-target" );
	var target    = target_id ? document.getElementById( target_id ) : null;
	var last_char = WordLimit.LastChar  ( textarea.value );
	var words     = WordLimit.CountWords( textarea.value );
	var truncated = false;
	
	if ( limit < words )
	{
		textarea.value = WordLimit.TruncateTextToWords( textarea.value, limit );

		words = WordLimit.CountWords( textarea.value );

		truncated = true;
	}

	if ( truncated )
	{
		switch ( last_char )
		{
		case  " ":
		case "\n":
			alert( "Warning, your have reached the word limit!" );
		}
	}

	if ( target ) target.innerHTML = (words) + " words";
}

WordLimit.CountWords
=
function( value )
{
	return value.split( " " ).length;
}


WordLimit.TruncateTextToWords
=
function( value, limit )
{
	var words     = 0;
	var i         = -1;
	
	while ( -1 != (i = WordLimit.NextWhitespace( value, i + 1 )) )
	{
		words++;

		if ( limit < words ) break;
	}

	if ( -1 == i ) i = value.length;

	return value.substring( 0, i );
}

WordLimit.LastChar
=
function( value )
{
	return value.length ? value.substring( value.length - 1, value.length ) : null;
}


WordLimit.NextWhitespace
=
function( value, i )
{
	var s = value.indexOf(  " ", i );
	var n = value.indexOf( "\n", i );
	var r = -1;

	if ( (-1 != s) && (-1 != n) )
	{
		r = Math.min( s, n );
	}
	else
	if ( -1 != s )
	{
		r = s;
	}
	else
	if ( -1 != n )
	{
		r = n;
	}

	return r;
}
