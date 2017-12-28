/*
 *  PureJavacript, APIServer.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

APIServer = Resolve;

function Resolve()
{
    var base_domain = Resolve.ExtractBaseDomain( location.hostname );
	var dom = "";

	switch ( location.protocol )
	{
	case "http:":
		dom = location.protocol + "//api-" + base_domain + ":8080";
		break;

	case "https:":
		dom = location.protocol + "//api-" + base_domain + ":8443";
		break;
	}

	return dom;
}

Resolve.ExtractBaseDomain
=
function( domain )
{
	var base_domain = "";
	var bits = domain.split( "-" );
	
	if ( 1 == bits.length )
	{
		base_domain = bits[0];
	}
	else
	{
		base_domain = bits[1];
	}
	return base_domain;
}

