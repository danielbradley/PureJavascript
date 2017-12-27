/*
 *  PureJavacript, Geocode.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function Geocode( latitude, longitude, handler )
{
	var GOOGLE_URL = "https://maps.googleapis.com";
	
	var parameters = new Object();
		parameters.latlng = latitude + "," + longitude;

    /*
     *  https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=API_KEY
     */

	Call( GOOGLE_URL, "/maps/api/geocode/json/", parameters, handler );
}

