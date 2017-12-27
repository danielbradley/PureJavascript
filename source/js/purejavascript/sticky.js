
//----------------------------------------------------------------------------
//	Sticky
//----------------------------------------------------------------------------

purejavascript.sticky = {}

purejavascript.setup.sticky
=
function()
{
	if ( ! IE8() )
	{
		purejavascript.sticky.stickies = new Array();

		var divs = document.getElementsByTagName( "div" );
		var n    = divs.length;

		for ( var i=0; i < n; i++ )
		{
			if ( purejavascript.hasClass( divs[i], "sticky" ) )
			{
				purejavascript.sticky.stickies.push( divs[i] );

				divs[i].findOffsetParent = purejavascript.sticky.findOffsetParent;
				divs[i].style.position   = "fixed";
				
				console.log( "Adding sticky" );
			}
		}

		purejavascript.addEventListener( window, "scroll", purejavascript.sticky.onscroll );
	}
}

purejavascript.sticky.onscroll
=
function()
{
	var stickies = purejavascript.sticky.stickies;
	var n        = stickies.length;

	for ( var i=0; i < n; i++ )
	{
		var div = stickies[i];

		purejavascript.sticky.processDiv( div );
	}
}

purejavascript.sticky.processDiv
=
function( div )
{
	var  parent = div.findOffsetParent();
	if ( parent )
	{
		var hp = parent.clientHeight;
		var h  = div.clientHeight;
		var y1 = div.offsetTop;
		var y2 = purejavascript.scrollOffsetY();

		if ( y2 > (hp - h) )
		{
			div.style.position = "absolute";
			div.style.bottom   = "0px";
		}
		else if ( "absolute" == div.style.position )
		{
			div.style.position = "fixed";
			div.style.bottom   = "";
		}
	}
}

purejavascript.sticky.findOffsetParent
=
function()
{
	var div = this;
	
	while ( (div = div.parentNode) )
	{
		if ( purejavascript.hasClass( div, "relative" ) )
		{
			break;
		}
	}

	return div;
}


