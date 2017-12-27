
DataStorage = {}

DataStorage.Exists
=
function()
{
	return typeof( Storage ) !== "undefined";
}

/*
 *	Local (perminent) storage.
 */

DataStorage.Local   = {}

DataStorage.Local.SetItem
=
function( key, value )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		if ( value && "" != value )
		{
			window.localStorage.setItem( key, value );
		
			success = (window.localStorage.key == value);
		}
	}
	return success;
}

DataStorage.Local.GetItem
=
function( key )
{
	var value = null;

	if ( LocalStorage.Exists() )
	{
		value = window.localStorage.getItem( key );
	}
	return value;
}

DataStorage.Local.RemoveItem
=
function( key )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		window.localStorage.removeItem( key );
		
		success = (window.localStorage.key == null);
	}
	return success;
}

DataStorage.Local.HasItem
=
function( key )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		success = window.localStorage.hasOwnProperty( key );
	}
	return success;
}

/*
 *	Session (non-perminent) storage
 */

DataStorage.Session = {}

DataStorage.Session.SetItem
=
function( key, value )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		if ( value && "" != value )
		{
			window.sessionStorage.setItem( key, value );
		
			success = (window.sessionStorage.key == value);
		}
	}
	return success;
}

DataStorage.Session.GetItem
=
function( key )
{
	var value = null;

	if ( LocalStorage.Exists() )
	{
		value = window.sessionStorage.getItem( key );
	}
	return value;
}

DataStorage.Session.RemoveItem
=
function( key )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		window.sessionStorage.removeItem( key );
		
		success = (window.sessionStorage.key == null);
	}
	return success;
}

DataStorage.Session.HasItem
=
function( key )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		success = window.sessionStorage.hasOwnProperty( key );
	}
	return success;
}
