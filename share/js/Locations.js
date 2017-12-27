/*
 *  PureJavacript, Locations.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Locations              = {}
Locations.SearchValues = GetSearchValues
Locations.SearchValue  = GetSearchValue
Locations.Up           = Up
Locations.CreateDownFn = CreateDownFn
Locations.Down         = Down

function GetSearchValues()
{
	var object = new Object;
	
	var bits = window.location.search.substring( 1 ).split( "&" );
	var n    = bits.length;
	
	for ( var i=0; i < n; i++ )
	{
		var keyvalue = bits[i].split( "=" );

        if ( 2 == keyvalue.length )
        {
            var key      = decodeURIComponent( keyvalue[0] );
            var value    = decodeURIComponent( keyvalue[1] );

            object[key] = value;
        }
	}
	return object;
}

function GetSearchValue( name )
{
	var parameters = GetSearchValues();
	
	return parameters[name] ? parameters[name] : "";
}

function Up( search_parameters )
{
	var loc  = location.protocol + "//" + location.host;
	var bits = location.pathname.split( "/" );
	var path = "";

    if ( null == search_parameters )
    {
        search_parameters = new Array();
    }

	switch ( bits.length )
	{
	case 0: // ""
	case 1: // Can't happen
		path = "/";
		break;
	
	case 2: // "/"
		path = "/";
		break;
	
	default:
		bits = ("" == bits[bits.length - 1]) ? bits.slice( 0, -2 ) : bits.slice( 0, -1 );
		path = bits.join( "/" ) + "/";
	}

	loc += path;

    if ( 0 == search_parameters.length )
    {
        loc += location.search;
    }
    else
    {
        loc += "?";

        for ( key in search_parameters )
        {
            loc += search_parameters[key] + "=" + GetSearchValue( search_parameters[key] ) + "&";
        }
        loc = loc.substring( 0, loc.length - 1 );
    }

	location.replace( loc );
}

function CreateDownFn( pathname, search )
{
    return function()
    {
        Down( pathname, search );
    }
}

function Down( pathname, search )
{
    var loc  = location.protocol + "//" + location.host + location.pathname + pathname + search;

    if ( -1 !== loc.indexOf( '%' ) )
    {
        var parameters = Locations.SearchValues();

        loc = Replace( loc, parameters );
    }

    location.replace( loc );
}

