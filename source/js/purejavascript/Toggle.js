
function Toggle( id )
{
	var ret = null;
	var e = document.getElementById( id );
	
	if ( e )
	{
		if ( null === e.offsetParent )
		{
			ret = Toggle.Show( e );
		}
		else
		{
			ret = Toggle.Hide( e );
		}
	}
	
	return ret;
}

Toggle.Show
=
function ( e )
{
	e.style.display    = "block";
	e.style.visibility = "visible";

	return true;
}

Toggle.Hide
=
function ( e )
{
	e.style.display    = "none";
	e.style.visibility = "hidden";

	return false;
}
