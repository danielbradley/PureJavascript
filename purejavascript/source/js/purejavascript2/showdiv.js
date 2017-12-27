
purejavascript.showdiv = {}

purejavascript.setup.showdiv
=
function()
{
	var elements = document.getElementsByTagName( 'a' );
	var n        = elements.length;

	for ( var i=0; i < n; i++ )
	{
		if ( 'showdiv' == elements[i].getAttribute( 'data-action' ) )
		{
			elements[i].onclick = purejavascript.showdiv;
		}
	}
}

purejavascript.showdiv
=
function ( event )
{
	var  target = this.getAttribute( "data-target" );
	if ( target )
	{
		var  div = document.getElementById( target );
		if ( div )
		{
			div.style.display = 'block';
		}
	}
	return false;
}
