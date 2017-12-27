/*
 *  PureJavacript, Base64.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

Base64 = {}
Base64.Encode = Base64Encode;
Base64.Decode = Base64Decode;

function Base64Encode( data )
{
	return btoa( data );
}

function Base64Decode( base64 )
{
	return atob( base64 );
}

