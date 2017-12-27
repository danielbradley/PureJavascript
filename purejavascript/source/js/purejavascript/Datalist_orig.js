
function Datalist( elements )
{
	var n = elements.length;
	
	for ( var i=0;i < n; i++ )
	{
		var e = elements[i];
	
		if ( AddClass.Contains( e, "datalist" ) ) Datalist.Setup( e );
	}

	document.addEventListener( "keydown", Datalist.KeyHandler );
}

Datalist.Setup
=
function( datalist )
{
	if ( datalist.hasAttribute( "data-kind" ) )
	{
		var kind       = datalist.getAttribute( "data-kind" );
		var parameters = GetSearchValues();
			parameters.kinds = kind;
	
		Call( "/api/multiselect/", parameters, function( responseText ) { Datalist.SetupListItems( datalist, responseText ); } );
	}
	else
	{
		Datalist.SetupFunctions( datalist );
	}
}

Datalist.SetupListItems
=
function( datalist, responseText )
{
	var json = JSON.parse( responseText );
	var kind = datalist.getAttribute( "data-kind" );
	
	if ( "OK" == json.status )
	{
		var n = json.results.length;

		var ul = document.createElement( "UL" );
		
		for ( var i=0; i < n; i++ )
		{
			var tuple = json.results[i];
			
			if ( tuple.name == kind )
			{
				var m = tuple.tuples.length;
				
				for ( var j=0; j < m; j++ )
				{
					var li = document.createElement( "LI" );
						li.innerHTML = tuple.tuples[j].text;

					ul.appendChild( li );
				}
				break;
			}
		}
	}
	
	datalist.appendChild( ul );
	
	Datalist.SetupFunctions( datalist );
}

Datalist.SetupFunctions
=
function( datalist )
{
	var datalist_id = datalist.getAttribute( "id"          );
	var target_id   = datalist.getAttribute( "data-target" );
	
	if ( datalist_id && target_id )
	{
		var target = document.getElementById( target_id );
		
		if ( target )
		{
			var list_items = datalist.getElementsByTagName( "LI" );
			var n = list_items.length;
			
			for ( var i=0; i < n; i++ )
			{
				var li = list_items[i];
				
				li.onmouseover = Datalist.OnMouseOver;
				li.onmouseout  = Datalist.OnMouseOut;
				li.onclick     = Datalist.OnClick;
			}
			
			//target.onfocus    = function() { Datalist.OnInput   ( event, datalist_id ); };
			target.oninput    = function() { Datalist.OnInput   ( event, datalist_id ); };
			target.onfocusout = function() { Datalist.OnFocusOut( event, datalist_id ); };
		}
	}
}

Datalist.OnMouse
=
function( event, selected )
{
	var datalist   = event.target.parentNode;
	var list_items = datalist.getElementsByTagName( "LI" );
	var n = list_items.length;
			
	for ( var i=0; i < n; i++ )
	{
		var li = list_items[i];
		
		RemoveClass( li, "selected" );
	}

	if ( selected ) AddClass( event.target, "selected" );
}

Datalist.OnMouseOver = function( event ) { Datalist.OnMouse( event,  true ); }
Datalist.OnMouseOut  = function( event ) { Datalist.OnMouse( event, false ); }

Datalist.OnClick
=
function( event )
{
	var target_id = event.target.parentNode.getAttribute( "data-target" );

	if ( target_id )
	{
		var target = document.getElementById( target_id );
		
		if ( target )
		{
			target.value = event.target.innerHTML.trim();

			event.target.parentNode.style.display = "none";
			event.target.parentNode.ignoreFocus   = true;

			var evt = new Object();
				evt.target = target;
			
			if ( target.hasAttribute( "data-change-url" ) )
			{
				Save( evt );
			}
		}
	}
}

Datalist.OnInput
=
function( event, datalist_id )
{
	var datalist = document.getElementById( datalist_id );

	if ( ! datalist.ignoreFocus )
	{
		datalist.style.display = "block";

		var filter = event.target.value;
		
		var list_items = datalist.getElementsByTagName( "LI" );
		var n          = list_items.length;
		
		for ( var i=0; i < n; i++ )
		{
			var li = list_items[i];

			if ( -1 == li.innerHTML.indexOf( filter ) )
			{
				li.style.display = "none";
			}
			else
			{
				li.style.display = "block";
			}
		}
	}
	else
	{
		datalist.ignoreFocus = false;
	}
}

Datalist.OnFocusOut
=
function( event, datalist_id )
{
	var datalist   = document.getElementById( datalist_id );
	var list_items = datalist.getElementsByTagName( "LI" );
	var hide       = true;
	var n          = list_items.length;
			
	for ( var i=0; i < n; i++ )
	{
		var li = list_items[i];

		if ( AddClass.Contains( li, "selected" ) )
		{
			hide = false;
			break;
		}
	}

	if ( hide ) Datalist.HideDatalists( document.getElementsByTagName( "UL" ) );
}

Datalist.KeyHandler
=
function( evt )
{
	evt = evt || window.event;

	var isTab    = ( 9 == evt.keyCode);
	var isEnter  = (13 == evt.keyCode);
	var isEscape = (27 == evt.keyCode);
	var isUp     = (38 == evt.keyCode);
	var isDown   = (40 == evt.keyCode);

	if ( isTab )
	{
		Datalist.HideDatalists( document.getElementsByTagName( "UL" ) );
	}
	else
	if ( isEnter )
	{
		Datalist.ClickCurrentSelection();
	}
	else
	if ( isEscape )
	{
		Datalist.HideDatalists( document.getElementsByTagName( "UL" ) );
	}
	else
	if ( isUp )
	{
		Datalist.MoveCurrentSelection( -1 );
	}
	else
	if ( isDown )
	{
		Datalist.MoveCurrentSelection( 1 );
	}
}

Datalist.HideDatalists
=
function( elements )
{
	var n = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var e = elements[i];
	
		if ( AddClass.Contains( e, "datalist" ) )
		{
			e.style.display = "none";
			e.scrollTop     = 0;

			Datalist.UnselectItems( e );
		}
	}
}

Datalist.UnselectItems
=
function( datalist )
{
	var elements = datalist.getElementsByTagName( "LI" );
	var n        = elements.length;

	for ( var i=0; i < n; i++ )
	{
		var e = elements[i];

		RemoveClass( e, "selected" );
	}
}

Datalist.MoveCurrentSelection
=
function( delta )
{
	var datalist = Datalist.FindActiveDatalist();
	var elements = datalist.getElementsByTagName( "LI" );
	var n        = elements.length;
	var i        = -1;
	var p        = null;
	var s        = null;
	
	for ( i=0; i < n; i++ )
	{
		var e = elements[i];

		if ( AddClass.Contains( e, "selected" ) )
		{
			p = e;
			break;
		}
	}

	if ( (-1 == delta) && (i != n) )
	{
		for ( var j=i-1; j >= 0; j-- )
		{
			var e = elements[j];

			if ( null !== e.offsetParent )
			{
				s = e;
			
				AddClass   ( e, "selected" );
				RemoveClass( p, "selected" );
				break;
			}
		}
	}
	else
	if ( 1 == delta )
	{
		if ( i == n ) i = -1;

		for ( var j=i+1; j < n; j++ )
		{
			var e = elements[j];

			if ( null !== e.offsetParent )
			{
				s = e;
			
				AddClass   ( e, "selected" );
				RemoveClass( p, "selected" );
				break;
			}
		}
	}
	
	if ( s )
	{
		console.log( "offsetTop: " + s.offsetTop );

		if ( (1 == delta) && (s.offsetTop > 439) )
		{
			s.offsetParent.scrollTop += s.scrollHeight + 1;
		}
	}
}

Datalist.ClickCurrentSelection
=
function()
{
	var datalist = Datalist.FindActiveDatalist();

	if ( datalist )
	{
		var elements = datalist.getElementsByTagName( "LI" );
		var n        = elements.length;
		var i        = -1;
		
		for ( i=0; i < n; i++ )
		{
			var e = elements[i];
			
			if ( AddClass.Contains( e, "selected" ) )
			{
				e.click();
				break;
			}
		}
	}
}

Datalist.FindActiveDatalist
=
function()
{
	var ret      = null;
	var elements = document.getElementsByTagName( "UL" );
	var n        = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var e = elements[i];
	
		if ( AddClass.Contains( e, "datalist" ) && (null != e.offsetParent) )
		{
			ret = e;
			break;
		}
	}
	return ret;
}
