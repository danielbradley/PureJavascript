
purejavascript.hideancestor = {}

purejavascript.setup.hideancestor
=
function()
{
	var inputs = document.getElementsByTagName( 'a' );
	var n      = inputs.length;

	for ( var i=0; i < n; i++ )
	{
		if ( 'hideancestor' == inputs[i].getAttribute( 'data-action' ) )
		{
			inputs[i].onclick = purejavascript.hideancestor;
		}
	}
}

purejavascript.hideancestor
=
function ( event )
{
	var  group  = this.getAttribute( "data-group"  );
	var  cookie = this.getAttribute( "data-cookie" );
	var  target = this.getAttribute( "data-target" );
	if ( group )
	{
		var parent = this.parentNode;

		while ( parent )
		{
			if ( parent.getAttribute( "data-group" ) == group )
			{
				parent.style.display = "none";

				if ( target )
				{
					document.getElementById( target ).style.display = "none";
				}
				break;
			}
			else
			{
				parent = parent.parentNode;
			}
		}

		if ( cookie )
		{
			document.cookie = cookie;
		}
	}
	
	return false;
}
