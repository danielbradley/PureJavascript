
purejavascript       = {}
purejavascript.setup = {}

function IE8()
{
	var isIE8 = navigator.userAgent.match(/MSIE 8.0/g) ||
				navigator.userAgent.match(/MSIE 7.0/g) ||
				navigator.userAgent.match(/MSIE 6.0/g);
	
	return isIE8;
}

purejavascript.self
=
function ( self )
{
	var self = self;
	
	if ( window === self ) self = window.event.srcElement;

	return self;
}

purejavascript.addEventListener
=
function ( element, eventName, func )
{
	if ( element.addEventListener )
	{
		element.addEventListener( eventName, func, false );
	}
	else
	{
		element.attachEvent( "on" + eventName, func );
	}
}

purejavascript.call
=
function( command )
{
	var asynchronous = true;

	var httpRequest = new XMLHttpRequest();
		httpRequest.open( "POST", "/api/index.php", asynchronous );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

	if ( asynchronous )
	{
		httpRequest.onreadystatechange
		=
		function()
		{
			if ( (4 == httpRequest.readyState) && (200 == httpRequest.status) )
			{
				//authentic.set_progress_bar( httpRequest.responseText );
			}
		}
		httpRequest.send( command );
	}
	else
	{
		httpRequest.send( command );
		//authentic.set_progress_bar( httpRequest.responseText );
	}
}

purejavascript.syncCall
=
function( command )
{
	var asynchronous = false;

	var httpRequest = new XMLHttpRequest();
		httpRequest.open( "POST", "/api/index.php", asynchronous );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
		httpRequest.send( command );

		return httpRequest.responseText;
}

purejavascript.apicall
=
function( $command )
{
	var httpRequest = new XMLHttpRequest();
	    httpRequest.open( "GET", "/api/index.php?" + $command, false );
		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	    httpRequest.send();

	return httpRequest.responseText;
}

purejavascript.scrollOffsetX
=
function()
{
	//	Modified from: http://stackoverflow.com/questions/10286162/pageyoffset-scrolling-and-animation-in-ie8

	var x = -1;

	if ( window.pageXOffset )
	{
		x = window.pageXOffset;
	}
	else
	if ( window.document.compatMode === "CSS1Compat" )
	{
		x = window.document.documentElement.scrollLeft;
	}
	else
	{
		x = window.document.body.scrollLeft;
	}
	return x;
}

purejavascript.scrollOffsetY
=
function()
{
	//	Modified from: http://stackoverflow.com/questions/10286162/pageyoffset-scrolling-and-animation-in-ie8

	var y = -1;

	if ( window.pageYOffset )
	{
		y = window.pageYOffset;
	}
	else
	if ( window.document.compatMode === "CSS1Compat" )
	{
		y = window.document.documentElement.scrollTop;
	}
	else
	{
		y = window.document.body.scrollTop;
	}
	return y;
}


purejavascript.preventDefault
=
function( event )
{
	if ( event && event.preventDefault )
	{
		event.preventDefault();
	}
	else
	{
		window.event.returnValue = false;
	}
}

purejavascript.stopPropagation
=
function( event )
{
	if ( event && event.stopPropagation )
	{
		event.stopPropagation();
	}
	else
	{
		event = window.event;
		event.cancelBubble = true;
	}
}

purejavascript.countChildDivs
=
function( element )
{
	var n   = 0;
	var len = element.childNodes.length;
	for ( var i=0; i < len; i++ )
	{
		if ( "DIV" == element.childNodes[i].tagName ) n++;
	}
	return n;
}

purejavascript.setYOffset
=
function()
{
	var y_offset = purejavascript.scrollOffsetY();
	
	var inputs   = document.getElementsByTagName( "input" );
	var n        = inputs.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( "pageyoffset" == inputs[i].getAttribute( "data-group" ) )
		{
			inputs[i].value = y_offset;
		}
	}
}

purejavascript.scrollByOffset
=
function()
{
	var pageyoffset = document.body.getAttribute( "data-pageyoffset" );
	var offset      = parseInt( pageyoffset );

	if ( !(NaN == offset) )
	{
		window.scrollBy( 0, offset );
	}
}

purejavascript.hasClass
=
function ( element, cls )
{
	var ret     = false;
	var classes = "'" + element.className + "'";

	if ( classes )
	{
		if ( cls == element.className )
		{
			ret = true;
		}
		else
		if ( -1 != classes.indexOf( " " + cls + " " ) )
		{
			ret = true;
		}
		else
		if ( -1 != classes.indexOf( " " + cls + "'" ) )
		{
			ret = true;
		}
		else
		if ( -1 != classes.indexOf( "'" + cls + " " ) )
		{
			ret = true;
		}
	}
	return ret;
}

purejavascript.addClass
=
function ( element, cls )
{
	if ( element && cls )
	{
		var classes = element.className;
		
		if ( ! purejavascript.hasClass( element, cls ) )
		{
			element.className += (" " + cls);
		}
	}
	else
	{
		console.log( "Could not find my self" );
	}
}

purejavascript.removeClass
=
function ( element, cls )
{
	var classes = element.className;
	var f = 0;
	var n = cls.length;

	if ( purejavascript.hasClass( element, cls ) )
	{
		var f = classes.indexOf( cls );

		if ( (0 < f) && (' ' == classes[f - 1]) ) f--;
	
		element.className = classes.substring( 0, f ) + classes.substring( f + n + 1 );
	}
}

purejavascript.setAllProperties
=
function(srcObject, destinationObj) {
    for (var _p in srcObject) destinationObj[_p] = srcObject[_p];
}

purejavascript.extend = function (context, destinationObj, key) {
    // More future-proofed than setAllProprties and also deals with arrays.
    // Adapted from
    //   http://stackoverflow.com/questions/9362716/how-to-duplicate-object-properties-in-another-object
    // The names and parameter order were changed to make more sense in the reading direction.
    
    for (key in context)
        if (context.hasOwnProperty(key))
            if (Object.prototype.toString.call(context[key]) === '[object Object]')
                destinationObj[key] = extend(destinationObj[key] || {}, context[key]);
            else
                destinationObj[key] = context[key];
    return destinationObj;
};

purejavascript.contains
=
function ( haystack, needle )
{
	return (-1 != haystack.indexOf( needle ));
}

purejavascript.isAlphanumeric
=
function ( string )
{
	//	Adapted from:
	//	http://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript

	var reg_exp = /^[A-Za-z0-9]+$/;
	return (string.match( reg_exp ));
}

purejavascript.isNumeric
=
function ( string )
{
	//	Adapted from:
	//	http://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript

	var reg_exp = /^[0-9]+$/;
	return (string.match( reg_exp ));
}

purejavascript.isLikeDomain
=
function ( string )
{
	//	Adapted from:
	//	http://stackoverflow.com/questions/13027854/javascript-regular-expression-validation-for-domain-name

	var reg_exp = /^[a-zA-Z0-9._-]+\\[a-zA-Z0-9.-]$/;
	return (string.match( reg_exp ));
}

purejavascript.findForm
=
function ( element )
{
	var parent = element.parentNode;
	
	while ( parent && ("form" != parent.tagName.toLowerCase()) )
	{
		parent = parent.parentNode;
	}
	
	return parent;
}

//purejavascript.isCountryCodeDomain
//=
//function( cc )
//{
//	return (2 == cc.length);
//}
//
//purejavascript.isSecondLevelDomain
//=
//function( sld )
//{
//	switch ( sld )
//	{
//	case "co":
//	case "com":
//	case "gov":
//	case "org":
//	case "edu":
//		return true;
//		
//	default
//		return false;
//	}
//}
//
//purejavascript.isTopLevelDomain
//=
//function( sld )
//{
//	switch ( sld )
//	{
//	case "co":
//	case "com":
//	case "gov":
//	case "org":
//	case "edu":
//	case "info":
//		return true;
//		
//	default
//		return false;
//	}
//}
//
//purejavascript.isValidDomainPair
//=
//function( cc, sld )	// Country code domain & Second level domain
//{
//	return purejavascript.isCountryCodeDomain( cc ) && purejavascript.isSecondLevelDomain( sld );
//}
//
//purejavascript.isValidInternetDomain
//=
//function( string )
//{
//	var success = false;
//	{
//		if ( purejavascript.isLikeDomain( string ) )
//		{
//			var bits = string.split('.');
//			var n    = bits.length;
//
//			if ( n > 1 )
//			{
//				success = purejavascript.isValidDomainPair( bits[n-1], bits[n-2] );
//				
//				if ( ! success )
//				{
//					success = purejavascript.isValidDomain( bits[n-1] );
//				}
//			}
//		}
//	}
//	return success;
//}
//
//purejavascript.extractEmailDomain
//=
//function( domain )
//{
//	var domain = "";
//	{
//		var bits = string.split('.');
//		var n    = bits.length;
//		
//		success = purejavascript.isTopLevelDomain( bits[n-1] );
//	}
//	return domain;
//}







