/*
 *  PureJavacript, Element.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Elements          = {}
Elements.Toggle   = Toggle
Elements.Show     = Toggle.Show
Elements.Hide     = Toggle.Hide
Elements.ShowHide = ShowHide;
Elements.HideShow = null;

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
    switch ( e.tagName )
    {
    case "TABLE":
        e.style.display    = "table";
        break;

    case "TR":
        e.style.display    = "table-row-group";
        break;

    case "TH":
        e.style.display    = "table-cell";
        break;

    case "TD":
        e.style.display    = "table-cell";
        break;

    default:
        e.style.display    = "block";
    }

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

Elements.HideShow
=
function ( cls, id )
{
    var elements = document.getElementsByClassName( cls );
    var e        = document.getElementById( id );
    var n        = elements.length;

    for ( var i=0; i < n; i++ )
    {
        Toggle.Hide( elements[i] );

        Class.RemoveClass( elements[i], "active" );
    }

    if ( e )
    {
        Toggle.Show( e );
        Class.AddClass( e, "active" );
    }

    return false;
}

function ShowHide( id, show_id, hide_id )
{
	var self   = document.getElementById( id );
	var show_e = document.getElementById( show_id );
	var hide_e = document.getElementById( hide_id );
	
	if ( show_e && hide_e )
	{
		Toggle.Hide( hide_e );
		Toggle.Show( show_e );
	}

	if ( self )
	{
		ShowHide.MakePeersInactive( self );
		ShowHide.MakeActive( self );
	}
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
	Class.AddClass( e, "active" );
}

ShowHide.MakeInactive
=
function( e )
{
	Class.RemoveClass( e, "active" );
}

