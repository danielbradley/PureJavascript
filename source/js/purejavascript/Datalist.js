
function Datalist( elements )
{
	var n = elements.length;
	
	for ( var i=0;i < n; i++ )
	{
		var e = elements[i];
	
		if ( Class.Contains( e, "datalist" ) ) Datalist.Setup( e );
	}

	document.addEventListener( "keydown", Datalist.KeyHandler );
}

Datalist.Setup
=
function( datalist )
{
	//datalist.autocomplete = "off";

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

	var id = datalist.getAttribute( "id" );
	var ul = document.createElement( "UL" );
		ul.className = "datalist_list";
		ul.setAttribute( "id", id + "-div" );
		ul.style.display = "none";

	datalist.parentNode.insertBefore( ul, datalist.nextSibling );
	datalist.sublist  = ul;
	//datalist.cascade  = onchange;
	datalist.onchange = null;
	
	if ( "OK" == json.status )
	{
		var n = json.results.length;

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
						li.dataListItemType = "prefixed";

					ul.appendChild( li );
				}

				for ( var j=0; j < m; j++ )
				{
					var li = document.createElement( "LI" );
						li.innerHTML = tuple.tuples[j].text;
						li.dataListItemType = "contains";

					ul.appendChild( li );
				}

				break;
			}
		}
	}
	
	Datalist.SetupFunctions( datalist );
}

Datalist.SetupFunctions
=
function( datalist )
{
	var list_items = datalist.sublist.getElementsByTagName( "LI" );
	var n = list_items.length;
			
	for ( var i=0; i < n; i++ )
	{
		var li = list_items[i];
				
			li.onmouseover = Datalist.OnMouseOver;
			li.onmouseout  = Datalist.OnMouseOut;
			li.onclick     = Datalist.OnClick;
	}

	datalist.oninput    = function() { Datalist.OnInput   ( event, datalist ); };
	datalist.onfocusout = function() { Datalist.OnFocusOut( event, datalist ); };
}

Datalist.OnInput
=
function( event, datalist )
{
	var div = datalist.sublist;

	if ( ! div.ignoreFocus )
	{
		div.style.display = "block";

		var filter = event.target.value;
		
		var list_items = div.getElementsByTagName( "LI" );
		var n          = list_items.length;
		
		for ( var i=0; i < n; i++ )
		{
			var li = list_items[i];

			var lcl = li.innerHTML.toLowerCase();
			var lcf = filter.toLowerCase();

			switch ( li.dataListItemType )
			{
			case "prefixed":

				// Case insensitive starts With
				if ( 0 != lcl.indexOf( lcf ) )
				{
					li.style.display = "none";
				}
				else
				{
					li.style.display = "block";
				}
				break;

			case "contains":

				// Case insensitive matching
				if ( -1 == lcl.indexOf( lcf ) )
				{
					li.style.display = "none";
				}
				else
				{
					li.style.display = "block";
				}
				break;
			}
		}
	}
	else
	{
		div.ignoreFocus = false;
	}
}

Datalist.OnMouse
=
function( event, selected )
{
	var datalist_list   = event.target.parentNode;
	var list_items = datalist_list.getElementsByTagName( "LI" );
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
	var li = event.target;
	var datalist_list = li.parentNode;
	var datalist      = datalist_list.previousSibling;

	if ( datalist )
	{
		datalist.value = li.innerHTML.trim();

		datalist_list.style.display = "none";
		datalist_list.ignoreFocus   = true;

		if ( datalist.form.hasAttribute( "data-change-url" ) )
		{
			var evt = new Object();
				evt.target = datalist;
		
			Save( evt );
		}
	}
}

Datalist.OnFocusOut
=
function( event, datalist )
{
	var list_items = datalist.sublist.getElementsByTagName( "LI" );
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

		evt.preventDefault();
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
	
		if ( AddClass.Contains( e, "datalist_list" ) )
		{
			e.style.display = "none";
			e.scrollTop     = 0;

			Datalist.UnselectItems( e );
		}
	}
}

Datalist.UnselectItems
=
function( datalist_list )
{
	var elements = datalist_list.getElementsByTagName( "LI" );
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
	
		if ( AddClass.Contains( e, "datalist_list" ) && (null != e.offsetParent) )
		{
			ret = e;
			break;
		}
	}
	return ret;
}
