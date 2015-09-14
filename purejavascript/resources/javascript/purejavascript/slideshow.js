
purejavascript.slideshow = {}

purejavascript.setup.slideshow
=
function()
{
	purejavascript.setup.slideshow.foreach( document.getElementsByTagName( "div" ) );
	purejavascript.setup.slideshow.foreach( document.getElementsByTagName( "a"   ) );
}

purejavascript.setup.slideshow.foreach
=
function( elements )
{
	if ( elements )
	{
		var n = elements.length;
		
		for ( var i=0; i < n; i++ )
		{
			var element = elements[i];
			
			if ( "slideshow" == element.getAttribute( "data-action" ) )
			{
				element.addEventListener( "click", purejavascript.slideshow.onClick, false );
			}
		}
	}
}

purejavascript.slideshow.onClick
=
function( event )
{
	var target = this.getAttribute( "data-target" );
	var value  = this.getAttribute( "data-value"  );

	purejavascript.slideshow.stopAllVideos();

	var  t = document.getElementById( target );
	if ( t )
	{
		t.current = (null != t.current) ? t.current : 0;

		var elements = t.getElementsByTagName( "div" );
		var n        = elements.length;
		var c        = t.current;
		var v        = 0;
		var x        = 0;
		var m        = 0;
		
		for ( var i=0; i < n; i++ )
		{
			if ( purejavascript.hasClass( elements[i], "slide" ) )
			{
				elements[i].style.display = "none";
				m++;
			}
		}

		if ( "next" == value )
		{
			v = (c + 1 + m) % m;
		}
		else
		if ( "last" == value )
		{
			v = (c - 1 + m) % m;
		}

		for ( var i=0; i < n; i++ )
		{
			if ( purejavascript.hasClass( elements[i], "slide" ) )
			{
				if ( v == x )
				{
					elements[i].style.display = "block";
				}
				x++;
			}
		}
		
		t.current = v;
	}
	return false;
}

purejavascript.slideshow.stopAllVideos
=
function()
{
	var elements = document.getElementsByTagName( "video" );
	var n        = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		elements[i].pause();
	}
}
