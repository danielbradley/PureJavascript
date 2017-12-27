
LocalStorage = {}

LocalStorage.Exists
=
function()
{
	return typeof( Storage ) !== "undefined";
}

LocalStorage.SetItem
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

LocalStorage.GetItem
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

LocalStorage.RemoveItem
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

LocalStorage.HasItem
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
