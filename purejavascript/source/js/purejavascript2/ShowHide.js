
/*
	Dependencies: AddClass, RemoveClass
 */

function ShowHide( id, show_id, hide_id )
{
	var self   = document.getElementById( id );
	var show_e = document.getElementById( show_id );
	var hide_e = document.getElementById( hide_id );
	
	if ( show_e && hide_e )
	{
		ShowHide.HideElement( hide_e );
		ShowHide.ShowElement( show_e );
	}

	if ( self )
	{
		ShowHide.MakePeersInactive( self );
		ShowHide.MakeActive( self );
	}
}

ShowHide.ShowElement
=
function( e )
{
	e.style.display    = "block";
	e.style.visibility = "visible";
}

ShowHide.HideElement
=
function( e )
{
	e.style.display    = "none";
	e.style.visibility = "hidden";
}

ShowHide.MakePeersInactive
=
function( e )
{
	if ( e.parentNode && e.parentNode.parentNode )
	{
		var children = e.parentNode.parentNode.getElementsByTagName( "A" );
		var n        = children.length;
		
		for ( var i=0; i < n; i++ )
		{
			var child = children[i];
		
			ShowHide.MakeInactive( child );
		}
	}
}

ShowHide.MakeActive
=
function( e )
{
	AddClass( e, "active" );
}

ShowHide.MakeInactive
=
function( e )
{
	RemoveClass( e, "active" );
}

