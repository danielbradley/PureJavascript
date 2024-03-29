/* PureJavascript version 4.1 */
/*
 *  PureJavacript, APIServer.js
 *
 *  Copyright 2014 - 2020, CrossAdaptive
 *
 *  License LGPL v2
 */

var
APIServer = Resolve;
APIServer.IsSubdomain = true;

function Resolve( host )
{
    if ( host === undefined ) host = "api";

    var base_domain = "." + location.hostname;

    if ( Resolve.UseExtractBaseDomain )
    {
        base_domain = Resolve.ExtractBaseDomain( location.hostname );
    }

    var base_domain = "." + location.hostname;
	var dom         = "";
    var http_port   = Resolve.httpPort  ? Resolve.httpPort  : "80";
    var https_port  = Resolve.httpsPort ? Resolve.httpsPort : "443";

	switch ( location.protocol )
	{
	case "http:":
		dom = location.protocol + "//" + host + base_domain + ":" + http_port;
		break;

	case "https:":
        dom = location.protocol + "//" + host + base_domain + ":" + https_port;
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

    //  If base_domain == 'example.com'
    if ( Resolve.IsRegisteredDomain( base_domain ) )
    {
        //  Then return '.example.com'
        base_domain = "." + base_domain;
    }
    else
    if ( APIServer.IsSubdomain )
    {
        //  Then return '.myapp.example.com'
        base_domain = "." + base_domain;
    }
    else    // If base_domain == 'myapp.example.com'
    {
        //  Then return '-myapp.example.com'
        base_domain = "-" + base_domain;
    }

	return base_domain;
}

Resolve.IsLocalAPIServer
=
function()
{
    return (-1 !== location.hostname.indexOf( ".local" )) || StringEndsWith( location.hostname, ".test" );
}

Resolve.IsRegisteredDomain
=
function( domain )
{
    //  First remove '.local' if it is on domain.
    domain = domain.replace( ".local", "" );

    //  Could be:
    //
    //  1)           example            returns false
    //  2)           example.com        returns true
    //  3)           example.com.au     returns true
    //  4)  mydomain.example.com        returns false
    //  5)  mydomain.example.com.au     returns false

    var bits = domain.split( "." );

    switch ( bits.length )
    {
    case 1:
        //  Is an invalid domain so return false.
        return false;

    case 2:
        //  Is a registered domain if last bit is a TLD.
        return Resolve.IsTopLevelDomain( bits[1] );

    case 3:
        //  Is a registered domain if last bit is a TLD.
        return Resolve.IsSecondLevelDomainOf( bits[1], bits[2] );

    default:
        //  Any with more will not be registered domain.
        return false;
    }
}

Resolve.IsTopLevelDomain
=
function( tld )
{
    switch( tld )
    {
    case "com":
    case "net":
    case "online":
    case "org":
    case "xyz":
        return true;

    default:
        return false;
    }
}

Resolve.IsSecondLevelDomainOf
=
function( sld, tld )
{
    switch( tld )
    {
    case "au":
        switch ( sld )
        {
        case "com":
        case "net":
        case "org":
        case "info":
            return true;

        default:
            return false;
        }
        break;

    default:
        return false;
    }
}

/*
 *  PureJavacript, Auth.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

var
Auth                    = {}
Auth.Login              = Auth_Login;
Auth.Login.LocalStorage = Auth_Login_LocalStorage;
Auth.Logout             = Auth_Logout;
Auth.LogoutAndReload    = Auth_LogoutAndReload;

function Auth_Login( event )
{
    event.preventDefault();

	Submit( event, Auth.Login.Handler );
}

function Auth_Login_LocalStorage( event )
{
    event.preventDefault();

    Submit( event, Auth.Login.LocalStorageHandler );
}

function Auth_Logout( logout_api_url )
{
	Auth.UnsetIDTypeCookie();
	Auth.UnsetSessionIDTypeCookie();
	Auth.UnsetCookie( "email" );

    if ( "string" === typeof logout_api_url )
    {
        Call(  logout_api_url, new Array(), Auth.Logout.Handler );
    }
    else
    {
    	Call( "/api/auth/logout/", new Array(), Auth.Logout.Handler );
    }

    if ( DataStorage.Local.HasItem( "sessionid" ) )
    {
        var storage = DataStorage.Local;

        storage.RemoveItem( "idtype"        );
        storage.RemoveItem( "accessid"      );
        storage.RemoveItem( "email"         );
        storage.RemoveItem( "given"         );
        storage.RemoveItem( "group_code"    );
        storage.RemoveItem( "sessionid"     );
        storage.RemoveItem( "Authorization" );
    }

    UnsetCookie( "accessid" );
}

function Auth_LogoutAndReload( logout_api_url )
{
	Auth.UnsetIDTypeCookie();
	Auth.UnsetSessionIDTypeCookie();
    Auth.UnsetCookie( "accessid"   );
	Auth.UnsetCookie( "email"      );
    Auth.UnsetCookie( "group_code" );

    if ( logout_api_url )
    {
        Call(  logout_api_url, new Array(), Auth.LogoutAndReload.Handler );
    }
    else
    {
        Call( "/auth/logout/", new Array(), Auth.LogoutAndReload.Handler );
    }
}

Auth.Login.Handler
=
function ( responseText )
{
    var json = JSON.parse( responseText );

    if ( json.idtype )
    {
        Auth.Login.Handler.Orig( responseText );
    }
    else
    {
        Auth.Login.Handler.New( responseText );
    }
}

Auth.Login.Handler.Orig
=
function ( responseText )
{
	if ( "" != responseText )
	{
		var obj = JSON.parse( responseText );

		if ( obj && obj.idtype )
		{
			Auth.SetIDTypeCookie( obj.idtype );
			//Auth.SetSessionIDTypeCookie( obj.sessionid );
			Auth.SetCookie( "email", obj.email, 1 );
            Auth.SetCookie( "group_code", obj.group_code, 1 );

			Redirect( obj.idtype ); // External Call
		}
		else
		{
			if ( obj["error"] == "INVALID_CREDENTIALS" )
			{
				var errorText = "Invalid username or password.";
			}
			else
			{
				var errorText = "Error logging in, please try again.";
			}

			var loginErrorDiv = document.getElementById( 'login-error' );

            if ( loginErrorDiv )
            {
				loginErrorDiv.innerHTML = "";
				loginErrorDiv.innerHTML = errorText;
            }
            else
            {
                alert( errorText );
            }
		}
	}
	else
	{
		Auth.Logout();
	}
}

Auth.Login.Handler.New
=
function( responseText )
{
    if ( "" != responseText )
    {
        var json = JSON.parse( responseText );

        if ( "ERROR" == json.status )
        {
            switch ( json.error.split( " " )[0] )
            {
            case "INVALID_USER":
            case "INVALID_PASSWORD":
            case "INVALID_CREDENTIALS":
                alert( "Invalid username or password." );
                break;

            case "INVALID_LOGINS":
                alert( "Too many invalid logins have occurred. To reset your invalid login count, please reset your password." );
                break;

            default:
                alert( "An unexpected error occurred, please try again later." );
            }
        }
        else if ( json.results && (1 !== json.results.length) )
        {
            alert( "Session was not returned as expected, please try again later." );
        }
        else
        {
            var obj = json.results[0];

            if ( obj && obj.idtype )
            {
                Auth.SetCookie( "accessid", obj.accessid, 1 );

                //Auth.SetIDTypeCookie( obj.idtype );
                //Auth.SetCookie( "Authorization", "",             1 );
                //Auth.SetCookie( "email",         obj.email,      1 );
                //Auth.SetCookie( "given",         obj.given_name, 1 );
                //Auth.SetCookie( "group_code",    obj.group_code, 1 );

                var redirect_path = obj.redirect_path ? obj.redirect_path : "/";
                var redirect_url  = location.protocol + "//" + location.host + redirect_path;

                location.assign( redirect_url );
            }
        }
    }
}

Auth.Logout.Handler
=
function ( responseText )
{
	location.assign( location.protocol + "//" + location.hostname + "/" );
}

Auth.LogoutAndReload.Handler
=
function ( responseText )
{
	location.reload();
}

Auth.SetIDTypeCookie
=
function( idtype )
{
	Auth.SetCookie( "idtype", idtype, 1 );
}

Auth.SetSessionIDTypeCookie
=
function( sid )
{
	Auth.SetCookie( "sessionid", sid, 1 );
}

Auth.UnsetCookie
=
function ( cname )
{
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.UnsetIDTypeCookie
=
function ()
{
	document.cookie = "idtype=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.UnsetSessionIDTypeCookie
=
function ()
{
	document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

Auth.SetCookie
=
function( cname, cvalue, exdays )
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + ";path=/;secure;SameSite=strict";
}

Auth.Login.LocalStorageHandler
=
function ( responseText )
{
    var json = JSON.parse( responseText );

    if ( "" != responseText )
    {
        var json = JSON.parse( responseText );

        if ( "ERROR" == json.status )
        {
            switch ( json.error.split( " " )[0] )
            {
            case "INVALID_USER":
            case "INVALID_PASSWORD":
            case "INVALID_CREDENTIALS":
                alert( "Invalid username or password." );
                break;

            case "INVALID_LOGINS":
                alert( "Too many invalid logins have occurred. To reset your invalid login count, please reset your password." );
                break;

            default:
                alert( "An unexpected error occurred, please try again later." );
            }
        }
        else if ( json.results && (1 !== json.results.length) )
        {
            alert( "Session was not returned as expected, please try again later." );
        }
        else
        {
            var obj = json.results[0];

            if ( obj && obj.idtype )
            {
                var storage = DataStorage.Local;

                storage.SetItem( "sessionid", obj.sessionid  );

                Auth.SetCookie( "accessid", obj.accessid, 1 );

                var redirect_path = obj.redirect_path ? obj.redirect_path : "/";
                var redirect_url  = location.protocol + "//" + location.host + redirect_path;

                location.assign( redirect_url );
            }
        }
    }
}

/*
 *  PureJavacript, Base64.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

var
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

/*
 *  PureJavacript, CSVFile.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function CSVFile( file_content )
{
	this.headers = new Array();
	this.rows    = new Array();

	this.parseContent( file_content );
}

CSVFile.prototype.getValueFor
=
function( row, labels )
{
	var value = "";
	var n     = labels.length;

	for ( var i=0; i < n; i++ )
	{
		var value = this.getValue( row, labels[i] );
		
		if ( "" != value ) break;
	}

	if ( undefined == value ) value = "";

	return value;
}

CSVFile.prototype.getValue
=
function( row, label )
{
	var value  = "";
	var column = -1;
	var n      = this.headers.length;
	
	for ( var i=0; i < n; i++ )
	{
		var text1 = label.toLowerCase().trim();
		var text2 = this.headers[i].toLowerCase().trim();
	
		if ( text1 == text2 )
		{
			column = i; break;
		}
	}

	if ( -1 != column )
	{
		var array = this.rows[row];
			value = array[column];
	}
	
	return value;
}

CSVFile.prototype.getNrOfRows
=
function()
{
	return this.rows.length;
}

CSVFile.prototype.CSVLineRE = new RegExp('("[\\w ,]+" ?|[\\w ]*), ?("[\\w ,]+" ?|[\\w ]*)$');

CSVFile.prototype.parseContent
=
function( file_content )
{
	var line_reader = new CSVFile.LineReader( file_content, 100000 );
	var line  = line_reader.readLine();
	if ( false !== line )
	{
        var trimmed = line.trim(); //trims CRs from Mac apps such as Numbers.
        //if (!this.CSVLineRE.test(trimmed)) throw "Header of file does not match expected Excel/LibreOffice CSV format."
		this.headers = CSVFile.SplitAndTrim( trimmed );


		while ( (false !== (line = line_reader.readLine())) )
		{
			var fields = CSVFile.SplitAndTrim( line );

			if ( "" != fields.join( "" ) )
			{
				this.rows.push( fields );
			}
		}
	}
}

CSVFile.SplitAndTrim
=
function( line )
{
	var line  = line.replace( /^&#xfeff;/, '' );
	var array = new Array();
	var bits  = CSVFile.SplitWhileRespectingQuotes( line, "," );
	var n     = bits.length;
	
	for ( var i=0; i < n; i++ )
	{
		var field = bits[i];
			field = field.trim();

		if ( "" != field )
		{
			var x     = field.length - 1;

			if ( '"' == field.charAt( x ) ) field = field.substring( 0, x );
			if ( '"' == field.charAt( 0 ) ) field = field.substring( 1    );

			field = field.trim();
		}
	
		array.push( field );
	}

	return array;
}

CSVFile.SplitWhileRespectingQuotes
=
function( line, delimiter )
{
	var array = Array();
	var out   = true;
	var s     = 0;
	var n     = line.length;
	
	for ( var i=0; i < n; i++ )
	{
		switch ( line.charAt( i ) )
		{
		case '"':
			out = !out;
			break;
			
		case delimiter:
			if ( out )
			{
				array.push( line.substring( s, i ) );
				s = i + 1;
			}
			break;
		}
	}
	
	if ( s < n )
	{
		array.push( line.substring( s, n ) );
	}
	
	return array;
}

CSVFile.LineReader
=
function( file_content, limit )
{
	this.content = CSVFileLineReaderUnicodeStrip( file_content );
	this.pos     = 0;
	this.lines   = 0;
	this.limit   = limit;
}

CSVFile.LineReader.prototype.readLine
=
function()
{
	var line     = false;
	var loop     = true;
	var in_quote = false;

	if ( ++this.lines < this.limit )
	{
		if ( this.pos < this.content.length )
		{
			line = "";
		
			while ( this.pos < this.content.length )
			{
				var ch = this.content[this.pos++];

				if ( 127 < ch )
				{
					// ignore 
				}
				else
				if ( '"' == ch )
				{
					in_quote = !in_quote;
					line += ch;
				}
				else
				if ( '\n' == ch )
				{
					if ( in_quote ) line += ch;
					else            break;
				}
				else if ( '\r' == ch )
				{
					if ( in_quote ) line += ch;
					else
					{
						if ( '\n' == this.content[this.pos] )
						{
							this.pos++;
						}
						break;
					}
				}
				else
				{
					line += ch;
				}
			}
		}
	}

	return line;
}

CSVFile.LineReader.prototype.unidecode
=
CSVFileLineReaderUnicodeStrip;

function CSVFileLineReaderUnicodeStrip( content )
{
	content = CSVFile.LineReader.prototype.unirecode( content );

	var str = "";
	var n   = content.length;
	var i   = 0;

	while ( i < n )
	{
		var ch = content.charCodeAt(i);

		if ( (ch == (0xFC | ch)) && (i+5 < n) )	// 6 byte unicode
		{
			i += 6;
		}
		else
		if ( (ch == (0xF8 | ch)) && (i+4 < n) )	// 5 byte unicode
		{
			i += 5;
		}
		else
		if ( (ch == (0xF0 | ch)) && (i+3 < n) )	// 4 byte unicode
		{
			i += 4;
		}
		else
		if ( (ch == (0xE0 | ch)) && (i+2 < n) )	// 3 byte unicode
		{
			var tmp1 = utf8_to_unicode( content.substring( i, i + 3 ) );
			var tmp2 = UTF8Codepoint( content.substring( i, i + 3 ) );
			var ent  = CodepointToEntity( tmp2 );

			str += ent;

			i += 3;
		}
		else
		if ( (ch == (0xC0 | ch)) && (i+1 < n) )	// 2 byte unicode
		{
			i += 2;
		}
		else
		if ( (ch == (0xC0 | ch)) && (i+1 < n) )	// 2 byte unicode
		{
			i += 2;
		}
		else
		if ( (ch == (0x80 | ch)) )	            // extra byte
		{
			console.log( "Warning detected invalid unicode" );
			i += 1;
		}
		else
		{
			str += content[i];		         	// ascii character
			i++;
		}
	}
	return str;
}


CSVFile.LineReader.prototype.unirecode
=
CSVFileLineReaderUnicodeRecode;

/*
 *	Based on:
 *	https://stackoverflow.com/questions/17267329/converting-unicode-character-to-string-format
 */

function CSVFileLineReaderUnicodeRecode( content )
{
	return content.replace( /\\u[\dA-F]{3}/gi, Unirecode );
}

function Unirecode( match )
{
	return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
}

function MyUnicode2HTML( content, start, end )
{
	var entity = "&#x";

	for ( var i = start; i < end; i++ )
	{
		var char_code = content.charCodeAt( i );
		var hex       = char_code.toString( 16 );

		entity += hex;
	}
	entity += ";";

	return entity;
}

function utf8_to_unicode( str )
{
	var unicode     = new Array();
	var values      = new Array();
	var looking_for = 0;
	var n           = str.length;

	for ( var i=0; i < n; i++ )
	{
		var val = str.charCodeAt( i );

		if ( val < 128 )
		{
			unicode.push( val );
		}
		else
		{
			if ( values.length == 0 )
			{
				looking_for = (val < 224) ? 2 : 3;
			}

			values.push( val );

			if ( values.length == looking_for )
			{
				var number = 0;

				if ( looking_for == 3 )
				{
					number = ((values[0] % 16) * 4096)
						   + ((values[1] % 64) *   64)
						   + ((values[2] % 64) *    1);
				}
				else
				{
					number = ((values[0] % 32) * 64)
					       + ((values[1] % 64) *  1);
				}

				unicode.push( number );
				values = new Array();
				looking_for = 1;
			} // if
		} // if
	} // for

	return unicode[0];
}

function UTF8Codepoint( utf8 )
{
	var codepoint   = 0;
	var val         = utf8.charCodeAt( 0 );

	if ( val < 128 )
	{
		codepoint = val;
	}
	else
	{
		var values      = new Array();
		var n           = utf8.length;
		var looking_for = (val < 224) ? 2 : 3;

		values.push( val );

		for ( var i=1; i < n; i++ )
		{
			val = utf8.charCodeAt( i );

			values.push( val );
		}

		if ( values.length == looking_for )
		{
			switch( looking_for )
			{
			case 3:
				codepoint = ((values[0] % 16) * 4096)
					      + ((values[1] % 64) *   64)
					      + ((values[2] % 64) *    1);
				break;

			case 2:
  				codepoint = ((values[0] % 32) *   64)
  						  + ((values[1] % 64) *    1);
  				break;
  			}
  		}
  	}

  	return codepoint;
}

function CodepointToEntity( codepoint )
{
	var entity = "&#x" + codepoint.toString( 16 ) + ";";

	return entity;
}

/*
 *  PureJavacript, Call.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 *
 *  License LGPL v2
 */

function Call( endpoint, parameters, custom_handler )
{
	parameters['wab_requesting_url'] = location.protocol + "//" + location.host + location.pathname;

	if ( DataStorage.Local.HasItem ( "sessionid" ) && !Call.UseXSessionIDHeader )
	{
		parameters['sid'] = DataStorage.Local.GetItem( "sessionid" );
	}

	if ( document.body.hasAttribute( "data-csrf" ) && !Call.UseXCSRFTokenHeader )
	{
		var csrf = document.body.getAttribute( "data-csrf" );

		if ( "NONE" != csrf ) parameters['wab_csrf_token'] = csrf;
	}

	var search = endpoint.indexOf( "?" );
	if ( -1 !== search )
	{
		var override_parameters = GetSearchValues.CreateDictionary( endpoint.substring( search ) );
		for ( const index in override_parameters )
		{
			parameters[index] = override_parameters[index];
		}
	}

	var command = Call.EncodeToString( parameters );
	var handler = (custom_handler) ? custom_handler : Call.DoNothing;

	if ( "http" != endpoint.substr( 0, 4 ) )
	{
		switch ( endpoint.substr( 0, 3 ) )
		{
		case "/ap":
		case "/au":
			endpoint = Resolve( "api" ) + endpoint;
			break;

		case "/fn":
			endpoint = Resolve( "fn"  ) + endpoint;
			break;
		}
	}

	if ( 'async' in parameters && ("true" === parameters['async']) )
	{
		var httpRequest = Call.Post( endpoint, command, null, 0, 0 );
			httpRequest.send( command );

			handler( null, event );
	}
	else
	{
		var target = event ? event.target : null;

		//var wrapper
		//=
		//function ( responseText )
		//{
		//	handler( responseText, target );
		//}

		var httpRequest = Call.Post( endpoint, command, handler, 0, 0 );

		if ( DataStorage.Local.HasItem( "sessionid" ) && Call.UseXSessionIDHeader )
		{
			httpRequest.setRequestHeader( "X-Session-ID", DataStorage.Local.GetItem( "sessionid" ) );
		}

		if ( document.body.hasAttribute( "data-csrf" ) && Call.UseXCSRFTokenHeader )
		{
			var csrf = document.body.getAttribute( "data-csrf" );

			if ( "NONE" != csrf )
			{
				httpRequest.setRequestHeader( "X-CSRF-Token", csrf );
			}
		}

		httpRequest.send( command );
	}
}

Call.Post
=
function ( endpoint, command, handler, timeout, timeouts )
{
	return Call.CreateXMLHttpRequest( "POST", endpoint, command, handler, timeout, timeouts );
}

Call.Get
=
function ( endpoint, command, handler, timeout, timeouts )
{
	return Call.CreateXMLHttpRequest( "GET", endpoint, command, handler, timeout, timeouts );
}

Call.CreateXMLHttpRequest
=
function( method, endpoint, command, handler, timeout, timeouts )
{
	var httpRequest = new XMLHttpRequest();
		httpRequest.open( method, endpoint, true );
		httpRequest.timeout           = timeout;
		httpRequest.timeouts          = timeouts;
		httpRequest.myEndpoint        = endpoint;
		httpRequest.myCommand         = command;
		httpRequest.myResponseHandler = handler;

		httpRequest.withCredentials = ("GET" != method) ? true : false;

		httpRequest.onreadystatechange
		=
		function()
		{
			Call.OnReadyStateChange( httpRequest, endpoint, handler );
		}

		httpRequest.ontimeout
		=
		function()
		{
			alert( "Giving up! Connection to the API server has timed out. Try again later." );
		}

		httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );

		return httpRequest;
}

Call.OnReadyStateChange
=
function( self, endpoint, handler )
{
	var status = self.status;

	switch ( self.readyState )
	{
	case 0:
	case 1:
	case 2:
	case 3:
		break;
		
	case 4:
		switch ( self.status )
		{
		case 200:
			console.log( "Called: " + endpoint );
			if ( handler ) handler( self.responseText );
			break;

		case 404:
			console.log( "Invalid API endpoint: " + endpoint );
			break;

		case 501:
			console.log( "Required SQL Stored Procedure Not Implemented" );
			break;

		case 503:
			console.log( "Sorry, the API server is currently unavailable. Please try again later. (503)" );
			break;

		case 0:
			console.log( "The network timed out... (0)" );
			break;
			
		default:
			console.log( "Got status: " + status );
		}
		self.onreadystatechange = null;
		break;
		
	default:
		console.log( "Unexpected httpRequest ready state: " + self.readyState );
		self.onreadystatechange = null;
	}
}

Call.EncodeToString
=
function( parameters )
{
	var string = "";
	var sep    = "";

	for ( const member in parameters )
	{
		if ( "" != member )
		{
			string += sep;
			string += encodeURIComponent( member );
			string += "=";
			string += encodeURIComponent( parameters[member] );

			sep = "&";
		}
	}
	return string;
}

Call.DoNothing
=
function ()
{}

/*
 *  PureJavacript, Class.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Class             = {}
Class.AddClass    = AddClass;
Class.RemoveClass = RemoveClass;

function AddClass( e, className )
{
	if ( ! Class.Contains( e, className ) )
	{
		if ( "" == e.className )
		{
			e.className = className;
		}
		else
		{
			e.className += " " + className;
		}
	}
}

function RemoveClass( e, className )
{
	if ( Class.Contains( e, className ) )
	{
		e.className = Class.Remove( e.className, className );
	}
}

Class.Remove
=
function( hay, needle )
{
	var ret = hay.replace( needle, "" ).trim();

	while ( -1 != ret.indexOf( "  " ) )
	{
		ret = ret.replace( "  ", " " );
	}
	
	return ret;
}

Class.Contains
=
function( e, className )
{
	//
	//	AddClass.Contains( { className="cls active" }, "active' );
	//
	//	var st = 10 - 6;
	//
	//	0123456789
	//	cls active
	//	01234

	var contains = false;

	if ( e && e.className && className )
	{
		var st = (e.className.length - className.length) - 1;

		if ( className == e.className )
		{
			contains = true;
		}
		else
		if ( 0 <= st )
		{
			if ( -1 != e.className.indexOf( " " + className + " " ) )
			{
				contains = true;
			}
			else
			if ( 0 == e.className.indexOf( className + " " ) )
			{
				contains = true;
			}
			else
			if ( st == e.className.indexOf( " " + className ) )
			{
				contains = true;
			}
		}
	}
	return contains;
}

/*
 *  PureJavacript, Convert.js
 *
 *  Copyright 2022, CrossAdaptive
 *
 *  License LGPL v2
 */

var
Convert = {}
Convert.ResponseTo = ConvertResponseTo;

function ConvertResponseTo( type, response ) // return [byte]
{
    var ret = [];

    switch ( type )
    {
    case "application/json":
        ret.push( JSON.stringify( response ) );
        break;

    case "text/csv":
        ret.push( ConvertResponseTo.ToCSV( response.results ) );
        break;
    }

    return ret;
}

ConvertResponseTo.ToCSV
=
function( results )
{
    var csv   = "";
    var n     = results.length;

    if ( 0 < n )
    {
        var first = results[0];
        var order = [];

        //  Write the headers to csv
        for ( const [key, value] of Object.entries(first) )
        {
            csv += '"' + HTMLEntities.Decode( key ) + '"' + ",";

            order.push( key );
        } 
        csv += '\n';

        //  Write each tuple as csv rows
        for ( var i=0; i < n; i++ )
        {
            var row = results[i];

            for ( const key in order )
            {
                value = row[order[key]];

                if ( value )
                {
                    csv += '"' + HTMLEntities.Decode( value ).replace( /"/g, '""' ) + '"' + ",";
                }
                else
                {
                    csv += '"' + value + '"' + ",";
                }
            }
            csv += '\n';
        }
    }
    return csv;
}

/*
 *  PureJavacript, Cookie.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Cookie            = {}
Cookie.Get        = GetCookie
Cookie.Set        = SetCookie
Cookie.Unset      = UnsetCookie

function GetCookie( search )
{
    var key = "";
    var val = "";

    if ( "" != search )
    {
        var bits = document.cookie.split( ";" );
        var n    = bits.length;

        for ( var i=0; i < n; i++ )
        {
            var keyval = bits[i].split( "=" );

            if ( (2 == keyval.length) && (keyval[0].trim() == search) )
            {
                val = keyval[1].trim();
                break;
            }
        }
    }

    return val;
}

function SetCookie( path, cname, cvalue, exdays )
{
    var p       = ("" != path) ? path : "/";
    var d       = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = (0 != exdays) ? "expires="+d.toUTCString() + ";" : "";
    var cookie  = cname + "=" + cvalue + "; " + expires + " " + "path=" + p + ";secure;SameSite=strict";
    
    document.cookie = cookie;
}

function UnsetCookie( name )
{
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

function SetIDTypeCookie( idtype )
{
	SetCookie( "/", "idtype", idtype, 1 );
}

function SetSessionIDTypeCookie( sid )
{
	SetCookie( "/", "sessionid", sid, 1 );
}

function UnsetIDTypeCookie()
{
	document.cookie = "idtype=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

function UnsetSessionIDTypeCookie()
{
	document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}

function SetSelectCookieFilter( event )
{
    var select = event.target;
    var path   = location.pathname;
    var name   = select.name;
    var value  = select.options[select.selectedIndex].value;

    SetCookie( path, name, value, 0 );

    location.reload();
}

/*
 *  PureJavacript, DataStorage.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
DataStorage         = {}
DataStorage.Local   = {}
DataStorage.Session = {}

DataStorage.Exists
=
function()
{
	return typeof( Storage ) !== "undefined";
}

DataStorage.Local.SetItem
=
function( key, value )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		if ( value || ("" == value.trim()) )
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

	if ( DataStorage.Exists() )
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

DataStorage.Session.SetItem
=
function( key, value )
{
	var success = false;

	if ( typeof( Storage ) !== "undefined" )
	{
		if ( value || ("" == value.trim()) )
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

	if ( DataStorage.Exists() )
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

DataStorage.SetSelectFilter
=
function( event )
{
    var select = event.target;
    var path   = location.pathname;
    var name   = select.name;
    var value  = select.options[select.selectedIndex].value;

    var key = name + "|" + path;

    if ( Session.user_hash )
    {
	    key = Session.user_hash + "|" + name + "|" + path;
	}

	DataStorage.Local.SetItem( key, value );

    location.reload();
}

/*
 *  PureJavacript, Datalist.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function Datalist( elements )
{
	var n = elements.length;
	
	for ( var i=0;i < n; i++ )
	{
		var e = elements[i];
	
		if ( Class.Contains( e, "datalist" ) ) Datalist.Setup( e );

		e.addEventListener( "keydown", Datalist.KeyHandler );
	}
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

	datalist.handler
	=
	function( event )
	{
        // Empty default handler.
    }
}

Datalist.SetupListItems
=
function( datalist, responseText )
{
	var json = JSON.parse( responseText );
	var kind = datalist.getAttribute( "data-kind" );

	if ( "" != kind )
	{
		datalist.setAttribute( "data-kind", "" );

		var id = datalist.getAttribute( "id" );
		var ul = document.createElement( "UL" );
			ul.className = "datalist_list";
			ul.setAttribute( "id", id + "-div" );
			ul.style.display = "none";

		datalist.parentNode.insertBefore( ul, datalist.nextSibling );
		datalist.sublist  = ul;
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
					
					/* Uncomment for a list of options that the search term is a prefix of.
					for ( var j=0; j < m; j++ )
					{
						var li = document.createElement( "LI" );
							li.innerHTML = tuple.tuples[j].text;
							li.dataListItemType = "prefixed";

						ul.appendChild( li );
					}
					*/

					for ( var j=0; j < m; j++ )
					{
						var li = document.createElement( "LI" );
							li.setAttribute( "data-name", tuple.tuples[j].name );
							li.setAttribute( "data-text", tuple.tuples[j].text );
							li.innerHTML        = tuple.tuples[j].text;
							li.dataListItemType = "contains";

						ul.appendChild( li );
					}
					break;
				}
			}
		}
		
		Datalist.SetupFunctions( datalist, ul );
	}
}

Datalist.SetupFunctions
=
function( datalist, ul )
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
	ul.onfocusout       = function() { Datalist.OnFocusOut( event, datalist ); };
}

Datalist.OutsideClick
=
function( event )
{
	console.log( event );
	Datalist.HideDatalists( document.getElementsByTagName( "UL" ) );
}

Datalist.OnInput
=
function( event, datalist )
{
	var div = datalist.sublist;

	if ( ! div.ignoreFocus )
	{
		div.style.display = "block";
		document.addEventListener( "click", Datalist.OutsideClick );

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
		datalist.setAttribute( "data-name", li.getAttribute( "data-name" ) );
		datalist.value = li.innerHTML.trim().replace( "&amp;", "&" );
		datalist.setCustomValidity( "" );

		datalist_list.style.display = "none";
		datalist_list.ignoreFocus   = true;

		if ( datalist.form.hasAttribute( "data-change-url" ) )
		{
			var evt = new Object();
				evt.target = datalist;
		
			Save( evt );
		}
		else
		{
			datalist.handler( datalist );
		}
	}
	document.removeEventListener( "click", Datalist.OutsideClick );
	event.stopPropagation();
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

		if ( Class.Contains( li, "selected" ) )
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
	
		if ( Class.Contains( e, "datalist_list" ) )
		{
			e.style.display = "none";
			e.scrollTop     = 0;

			Datalist.UnselectItems( e );
		}
	}

	document.removeEventListener( "click", Datalist.OutsideClick );
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

		if ( Class.Contains( e, "selected" ) )
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
			
			if ( Class.Contains( e, "selected" ) )
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
	
		if ( Class.Contains( e, "datalist_list" ) && (null != e.offsetParent) )
		{
			ret = e;
			break;
		}
	}
	return ret;
}

/*
 *  PureJavacript, Datetime.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Datetime         = {}
Datetime.IsValid = DateIsValid
Datetime.ToYMD   = YMDDate

function DateIsValid( $datetime )
{
	var is_date = false;

	switch ( $datetime )
	{
	case null:
	case "NULL":
	case "null":
	case "":
	case "0":
	case "0000-00-00":
	case "0000-00-00 00:00:00":
		break;
		
	default:
		is_date = true;
	}

	return is_date;
}

function YMDDate( date_string )
{
	var ymd_date = null;
	var ymd      = new Array();

	date_string = date_string.replace( /%2F/g, "/" );
	
	if ( -1 !== date_string.indexOf( "/" ) )
	{
		var parts = date_string.split( "/" );
		
		switch ( parts.length )
		{
		case 3:
			ymd[0] = (2 == parts[2].length) ? "20" + parts[2] : parts[2];
			ymd[1] = parts[1];
			ymd[2] = parts[0];
			break;
			
		case 2:
			ymd[0] = new Date().getFullYear();
			ymd[1] = parts[1];
			ymd[2] = parts[0];
		}
	}
	else
	if ( -1 !== date_string.indexOf( "-" ) )
	{
		ymd = date_string.split( "-" );
	}
	
	if ( 3 == ymd.length )
	{
		if ( (3 == ymd.length) && (4 == ymd[0].length) && (2 == ymd[1].length) && (2 == ymd[2].length) )
		{
			var year  = parseInt( ymd[0] );
			var month = parseInt( ymd[1] );
			var day   = parseInt( ymd[2] );

			if ( YMDDate.IsMonth( month ) && YMDDate.IsDayOfMonth( day, month ) )
			{
				ymd_date = ymd.join( '-' );
			}
		}
	}
	
	return ymd_date;
}

YMDDate.IsMonth
=
function( month )
{
	return (1 <= month) && (month <= 12);
}

YMDDate.IsDayOfMonth
=
function( day, month )
{
	switch ( month )
	{
	case 1:
	case 3:
	case 5:
	case 7:
	case 8:
	case 10:
	case 12:
		return (1 <= day) && (day <= 31);

	case 4:
	case 6:
	case 9:
	case 11:
		return (1 <= day) && (day <= 30);

	case 2:
		return (1 <= day) && (day <= 29);

	default:
		return false;
	}
}

/*
 *  PureJavacript, Element.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Elements            = {}
Elements.Toggle     = Toggle
Elements.Show       = Toggle.Show
Elements.Hide       = Toggle.Hide
Elements.ShowHide   = ShowHide;
Elements.HideShow   = null;
Elements.SetFnSetup   = null;
Elements.SetFnSubmit  = null;
Elements.SetFnHandler = null;

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
function ( e, display )
{
    if ( ! display )
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
	}
	else
	{
		e.style.display = display;
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
function ( cls, id, display )
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
        Toggle.Show( e, display );
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

Elements.SetFnSetup
=
function( id, fn )
{
	var e = document.getElementById( id );
	if ( e )
	{
		e.setup = fn;
	}
}

Elements.SetFnSubmit
=
function( id, fn )
{
	var e = document.getElementById( id );
	if ( e )
	{
		e.addEventListener( 'submit', fn );
	}
}

Elements.SetFnHandler
=
function( id, fn )
{
	var e = document.getElementById( id );
	if ( e )
	{
		e.handler = fn;
	}
}

Elements.SetFnEventListener
=
function( id, event_type, fn )
{
	var e = document.getElementById( id );
	if ( e )
	{
		e.addEventListener( event_type, fn );
	}
}

/*
 *  PureJavacript, Enum.js
 *
 *  Copyright 2017, CrossAdaptive
 */

function Enum( values )
{
    var e = {}
    var n = values.length;

    for ( var i=0; i < n; i++ )
    {
        var name = values[i]

        e[name] = name;
    }

    return e;
}

/*
 *  PureJavacript, Filter.js
 *
 *  Copyright 2017, CrossAdaptive
 */

//Filter = {}

function Filter( id, tag_name, pattern )
{
    var element = document.getElementById( id );

    if ( !element )
    {
        alert( "Filter: could not find target element: " + id );
    }
    else
    {
        var terms    = pattern.split( ' ' );
        var elements = element.getElementsByTagName( tag_name );
        var n        = elements.length;

        for ( var i=0; i < n; i++ )
        {
            var e     = elements[i];
            var title = e.getAttribute( "title" );
            var html  = e.innerHTML;

            Toggle.Show( e );

            for ( const index in terms )
            {
                var term = terms[index];

                if ( ! Filter.ElementContainsText( e, term ) )
                {
                    Toggle.Hide( e )
                    break;
                }
            }
        }
    }
}

Filter.ElementContainsText
=
function( e, t )
{
    var contains = false;

    if ( e.children && (0 < e.children.length) )
    {
        for ( const index in e.children )
        {
            var child = e.children[index];

            if ( (contains = Filter.ElementContainsText( child, t )) )
            {
                break;
            }
        }
    }
    else
    if ( Filter.StringContainsText( e.title, t ) )
    {
        contains = true;
    }
    else
    if ( Filter.StringContainsText( e.innerHTML, t ) )
    {
        contains = true;
    }

    return contains;
}

Filter.StringContainsText
=
function( s, t )
{
    var contains = false;

    if ( s )
    {
        if ( "" == t )
        {
            contains = true;
        }
        else
        {
            var lc_s = s.toLowerCase();
            var lc_t = t.toLowerCase();

            contains = (-1 != lc_s.indexOf( lc_t ));
        }
    }

    return contains;
}

Filter.TableBody
=
function( tbody_id, form )
{
    // 1)   Retrieve values frorm any selects/inputs in forms.

    var values = Filter.TableBody.RequiredValues( form ); // Returns text array.

    //  2)  Iterate through tables rows and show/hide matching/unmatching rows.

    var tbody  = document.getElementById( tbody_id );
    var rows   = tbody.getElementsByTagName( "TR" );
    var n      = rows.length;

    for ( var i=0; i < n; i++ )
    {
        var tr = rows[i];

        if ( -1 == tr.className.indexOf( "hidden" ) )
        {
            tr.style.display = Filter.TableBody.ContainsAll( tr, values ) ? "table-row" : "none";
        }
    }
}

Filter.TableBody.RequiredValues
=
function( form )
{
    var values = new Array();
    var n      = form.elements.length;

    for ( var i = 0; i < n; i++ )
    {
        var input = form.elements[i];

        switch ( input.tagName )
        {
        case "SELECT":
            var option = input.options[input.selectedIndex];
            var text   = option.text.toLowerCase();

            if ( option.value && ("" != text) )
            {
                values.push( text );
            }
            break;

        case "INPUT":
            if ( "" != input.value )
            {
                var bits = input.value.split( " " );
                for ( const index in bits )
                {
                    values.push( bits[index].toLowerCase() );
                }
            }
            break;
        }
    }

    return values;
}

Filter.TableBody.ContainsAll
=
function( tr, values )
{
    //  Returns true only if tr contains all values in passed array.

    var contains = true;
    var n        = values.length;

    for ( var i=0; i < n; i++ )
    {
        if (-1 === tr.innerHTML.toLowerCase().indexOf( values[i] ))
        {
            contains = false;
            break;
        }
    }

    return contains;
}

/*
 *  PureJavacript, Forms.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Forms                      = {}
Forms.Changed              = purejavascript_Forms_Changed
Forms.GetValues            = GetFormValues
Forms.InsertResponseValues = InsertResponseValues
Forms.InsertValues         = InsertFormValues
Forms.Save                 = Save
Forms.SelectAll            = SelectAll
Forms.Submit               = Submit
Forms.SubmitTableValues    = SubmitTableValues
Forms.Validate             = Validate
Forms.ValidateForm         = ValidateForm
Forms.Validate.Submit      = Validate.Submit

function purejavascript_Forms_Changed( event )
{
    var input   = event.target;
    var form    = input.form;
    var buttons = form.querySelectorAll( "BUTTON" );
    var n       = buttons.length;

    for ( var i=0; i < n; i++ )
    {
    	var submit = buttons[i];

	    if ( submit && ("button" != submit.type) )
	    {
	        submit.disabled = false;
	    }
	}
}

Forms.DisableAll
=
function( form )
{
	var len = form.elements.length;

	for ( var i=0; i < len; i++ )
	{
		form.elements[i].disabled = true;
	}
}

function GetFormValues( form )
{
	var object = new Object;

	if ( form && form.elements )
	{
		var n = form.elements.length;

		for ( var i=0; i < n; i++ )
		{
			var e     = form.elements[i];
			var key   = e.name;
			var value = e.value;

            if ( e.hasAttribute( "data-date-format" ) )
            {
                value = GetFormValues.ConvertDateToMySQLDateFormatFrom( value, e.getAttribute( "data-date-format" ) );
            }

			switch ( e.type )
			{
			case "checkbox":
				if ( ! e.disabled && e.checked )
				{
					value = e.checked ? value : "";
				}
                else
                {
                    value = "";
                }
				break;

			case "radio":
				var v = value;
				if ( ! e.checked )
				{
					key   = null;
					value = null;

					object[v] = 0;
				}
				else
				{
					object[v] = 1;
				}
				break;

			case "hidden":
				if ( "" != e.hasAttribute( "data-table" ) )
				{
					value = GetFormValues.ConvertTableToJSON( e.getAttribute( "data-table" ) );
				}
				break;
			}

			switch ( e.tagName )
			{
			case "BUTTON":
				value = e.innerHTML.trim();
				break;
			}
			
			if ( key && value )
			{
				if ( GetFormValues.IsTimeComponent( key ) )
				{
					key   = GetFormValues.GetTimePrefix( key );
					value = GetFormValues.ExtractTime( form, key );
				}
			
				if ( object[key] )
				{
					object[key] += ("," + value);
				}
				else
				{
					object[key] = value;
				}
			}
		}
	}
	else
	{
		console.log( "GetFormValues: null form passed!" );
	}
	return object;
}

function InsertResponseValues( formID, keyName, responseText )
{
	var status = false;

	if ( ! responseText )
	{
		alert( "Error, no content returned." );
	}
	else
	{
		var parameters = GetSearchValues();
		var form       = document.getElementById( formID );
		
		if ( form && ((null == keyName) || ("" != parameters[keyName])) )
		{
			form.autocomplete = "off";

			var json = JSON.parse( responseText );

			if ( json && form && ("OK" == json.status))
			{
				if ( 1 == json.results.length )
				{
					var tuple = json.results[0];

					form.disabled = ("1" === tuple["form_disabled"]);

					InsertFormValues( form, tuple );
				}

				status = true;

	            var submit = form.querySelector( "BUTTON[type='submit']" );
	            if ( submit )
	            {
	                submit.disabled = true;
	            }

	            for ( index in form.elements )
	            {
	                var input = form.elements[index];

	                if ( input.addEventListener )
	                {
	                	switch ( input.tagName )
	                	{
	                	case "SELECT":
		                    input.addEventListener( "change", Forms.Changed );
		                    break;

		                case "INPUT":
		                	switch ( input.type )
		                	{
			                case "checkbox":
			                case "radio":
			                case "file":
			                    input.addEventListener( "change", Forms.Changed );
			                    break;

			                default:
			                    input.addEventListener( "change", Forms.Changed );
			                    input.addEventListener( "keyup",  Forms.Changed );
			                }

			                if( "checkbox" == input.type )
			                {
			                	if ( input.setup )
			                	{
									input.setup( { "target": input } );
			                	}
			                }
			                break;

		                case "TEXTAREA":
		                	input.addEventListener( "keyup",  Forms.Changed );
		                	break;

		                default:
		                	break;
		                }
	                }

	                if ( ! input.disabled ) input.disabled = form.disabled;

	                if ( input.className )
	                {
	                	if ( -1 !== input.className.indexOf( "do_not_disable" ) )
	                	{
	                		input.disabled = false;
	                	}
	                }
	            }

	            var buttons = form.querySelectorAll( "BUTTON.validate" );
	        	var n       = buttons.length;

	            if ( 0 < n )
	            {
	            	if ( Forms.ValidateForm( form ) )
	            	{
	            		for ( var i=0; i < n; i++ )
	            		{
	            			buttons[i].disabled = false;
	            		}
	            	}
	            	else
	            	{
	            		for ( var i=0; i < n; i++ )
	            		{
	            			buttons[i].disabled = true;
	            		}
	            	}
	            }
			}
		}
	}
	return status;
}

function InsertFormValues( form, object )
{
	for ( var member in object )
	{
		if ( form[member] )
		{
			var input = form[member]; // May return one item or node list.
			var value = DecodeHTMLEntities( object[member] );

            if ( ("SELECT" != input.tagName) && input.length )
            {
                var n = input.length;

                for ( var i=0; i < n; i++ )
                {
                    if ( "radio" == input[i].type )
                    {
                        if ( value == input[i].value )
                        {
                            input[i].checked = true;
                        }
                    }
                }
            }
            else
			if ( input  && value )
			{
				if ( "INPUT" == input.tagName )
				{
					var ph = input.placeholder;
				
					if ( "checkbox" == input.type )
					{
						input.checked = (("0" == value) || ("" == value)) ? false : true;
					}
					else
                    if ( "radio" == input.type )
                    {
                        if ( value == input.value )
                        {
                            input.checked = true;
                        }
                    }
                    else
					{
						input.value = value;

						if ( input.hasAttribute( "data-cascade" ) )
						{
							Selects.DoCascade( input );
						}
					}
					input.placeholder = "";
					input.placeholder = ph;
				}
				else
				if ( "SELECT" == input.tagName )
				{
					if ( input.setValue )
					{
						input.setValue( value );
					}
					else
					{
						input.value = value;
					}
					
					input.setAttribute( "data-value", value );
				}
				else
				if ( "TEXTAREA" == input.tagName )
				{
					value = value.replace( /<br>/g, "\n" );
				
					input.innerHTML = value;

					if ( input.onchange )
					{
						var evt = new Object();
							evt.target = input;
						
						input.onchange( evt );
					}
				}
			}
		}
	}

	for ( var index in form.elements )
	{
		var input = form.elements[index];

		if ( input.getAttribute )
		{
			if ( "true" == input.getAttribute( "data-required" ) )
			{
				switch( input.type )
				{
				case "radio":
					if ( input.checked )
					{
						input.className += " desired";
					}
					break;

				default:
					if ( "" == input.value.trim() )
					{
						input.className += " desired";
					}
				}
			}

			if ( "true" == input.getAttribute( "data-confirmation" ) )
			{
				if ( "No" == input.value.trim() )
				{
					var target_id = input.getAttribute( "data-target" );
					if ( target_id )
					{
						var target = document.getElementById( target_id );

						if ( target )
						{
							target.className += " desired";
						}
					}
				}
			}
		}
	}

	var randoms = form.querySelectorAll( "INPUT[data-generate-random]" );
	var n       = randoms.length;

	for ( var i=0; i < n; i++ )
	{
		randoms[i].value = Strings.GenerateSalt();
	}
}

function Save( event, handler )
{
	var element     = event.target;
	var form        = event.target.form;
	var parameters  = GetFormValues( form );
	var url         = form.getAttribute( "data-change-url" );

	if ( ! parameters.hasOwnProperty( "USER" ) )
	{
	//	parameters.USER = Session.USER;
	}

	switch ( element.type )
	{
	case 'checkbox':
		parameters.name  = element.name;
		parameters.value = element.checked ? "1" : "0";
		break;
	
	case 'select-one':
	case 'text':
	default:
		parameters.name  = element.name;
		parameters.value = element.value;
	}

    if ( element.hasAttribute( "id" ) )
    {
        parameters.target_id = element.getAttribute( "id" );
    }

	Call( Resolve() + url, parameters, handler ? handler : Save.Handler );
}

Save.Handler
=
function( responseText )
{
	console.log( responseText );
}

function SelectAll( event, form_id )
{
	var input = event.target;
	var form  = document.getElementById( form_id );

	if ( form )
	{
		var inputs = form.querySelectorAll( "INPUT[type=checkbox]" );
		var n      = inputs.length;

		for ( var i=0; i < n; i++ )
		{
			inputs[i].checked = input.checked;
		}
	}
}

function Submit( event, custom_handler )
{
	var form    = event.target;
	var buttons = form.querySelectorAll( "BUTTON" );
	var n       = buttons.length;

	//
	//	Too many unintended consequences.
	//
	for ( var i=0; i < n; i++ )
	{
		var button = buttons[i];

		if ( "button" != button.type )
		{
			button.disabled = true;
		}
	}

	var handler    = custom_handler ? custom_handler : Submit.SubmitDefaultHandler;
	var parameters = GetFormValues( form );

	var submit     = form.elements['submit'];

	if ( submit && submit.value && ("delete" == submit.value.toLowerCase()) )
	{
		if ( form && form.hasAttribute( "data-delete-url" ) )
		{
			var url     = form.getAttribute( "data-delete-url" );
			var handler = form.handler ? form.handler : handler;

			Call( url, parameters, handler );
		}
	}
	else
	if ( form && form.hasAttribute( "data-url" ) )
	{
		var url        = form.getAttribute( "data-url" );
		var handler    = form.handler ? form.handler : handler;

		Call( url, parameters, handler );
	}
	else
	if ( form.hasAttribute( "data-submit-url" ) )
	{
		var url        = form.getAttribute( "data-submit-url" );
		var handler    = form.handler ? form.handler : handler;

		Call( url, parameters, handler );
	}
	return false;
}

Submit.SubmitDefaultHandler
=
function( responseText, target )
{
	var json = JSON.parse( responseText );
	
	if ( "OK" == json.status )
	{
        Locations.Up();
	}
}

Submit.SubmitReloadHandler
=
function( responseText )
{
	var json = JSON.parse( responseText );
	
	if ( "OK" == json.status )
	{
        location.reload();
	}
    else
    {
        alert( "Error: " + json.error )
    }
}

function SubmitTableValues( event, verify )
{
	var form       = event.target;
	var target_id  = form.getAttribute( "data-target" );
	var table      = document.getElementById( target_id );
	var endpoint   = table.getAttribute( "data-url" );
	var parameters = Forms.GetValues( form );
	var submit     = form.querySelectorAll( "BUTTON" );
	var n          = submit.length;

	for ( var i=0; i < n; i++ )
	{
		submit[i].disabled = true;
	}

	if ( ! verify )
	{
		verify
		=
		function( tr )
		{
			return true;
		}
	}

	if ( table && table.rows && (1 < table.rows.length) )
	{
		var i = SubmitTableValues.NextVerifiedRow( table, verify, 0 );

		if ( i )
		{
			SubmitTableValues.DoCall( endpoint, parameters, table, i, verify );
		}
		else
		{
			alert( "Finished submitting table values." );
		}
	}
	else
	{
		Call( "/auth/session/", new Object(), SubmitTableValues.Finish );
	}
	return false;
}

SubmitTableValues.NextVerifiedRow
=
function( table, verify, i )
{
	var j           = false;
	var progress_id = table.getAttribute( "data-progress" );
	var progress    = progress_id ? document.getElementById( progress_id ) : null;

	var loop = true;

	while ( table.rows[++i] )
	{
		if ( progress )
		{
			progress.style.width = (i / table.rows.length) * 100 + "%";
		}

		if ( verify( table.rows[i] ) )
		{
			j = i;
			break;
		}
	}

	if ( progress && ! table.rows[i] )
	{
		progress.style.width = "100%";
	}

	if ( progress && (i == table.rows.length) )
	{
		progress.style.background = "green";
	}

	return j;
}


SubmitTableValues.Handler
=
function( responseText, parameters, table, i, verify )
{
	var endpoint = table.getAttribute( "data-url" );
	var json     = "";

	try
	{
		json = JSON.parse( responseText );
	}
	catch ( err )
	{
		console.log( responseText );
	}

	SubmitTableValues.MarkupRow( json, table, i );

	var i = SubmitTableValues.NextVerifiedRow( table, verify, i );

	if ( false !== i )
	{
		SubmitTableValues.DoCall( endpoint, parameters, table, i, verify );
	}
	else
	{
		var progress_id = table.getAttribute( "data-progress" );

		if ( progress_id )
		{
			var progress    = document.getElementById( progress_id );
				progress.style.width = "100%";
		}

		Call( "/auth/session/", new Object(), SubmitTableValues.Finish );
	}
}

SubmitTableValues.DoCall
=
function( endpoint, parameters, table, i, verify )
{
	var combined_parameters = SubmitTableValues.ConvertTRToParameters( parameters, table.rows[i] );

	Call
	(
		endpoint,
		combined_parameters,
		function ( responseText )
		{
			var table_copy = table;
			var i_copy     = i;
			var v_copy     = verify;
	 
			SubmitTableValues.Handler( responseText, parameters, table_copy, i_copy, v_copy );
		}
	);
}

SubmitTableValues.MarkupRow
=
function( json, table, i )
{
	if ( "OK" == json.status )
	{
		table.rows[i].classList.add( "import_ok" );
		table.rows[i].style.background = "green";
		table.rows[i].style.color      = "white";
	}
	else
	if ( "EXISTS" == json.error )
	{
		table.rows[i].classList.add( "import_exists" );
		table.rows[i].style.background = "#888";
		table.rows[i].style.color      = "#ddd";
	}
	else
	{
		table.rows[i].classList.add( "import_error" );
		table.rows[i].style.background = "red";
		table.rows[i].style.color      = "white";
	}

	if ( "ERROR" == json.status )
	{
		table.rows[i].title = json.error;
	}

	if ( table.customRowHandler )
	{
		table.customRowHandler( table.rows[i], json );
	}
}

SubmitTableValues.ConvertTRToParameters
=
function( parameters, tr )
{
	var ret = SubmitTableValues.ConvertTRToParameters.Clone( parameters );
	var n   = tr.cells.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( "TD" == tr.cells[i].tagName )
		{
			var key = tr.cells[i].getAttribute( "data-name" );
			var val = tr.cells[i].innerHTML;
		
			if ( key && val )
			{
				ret[key] = val;
			}
		}
	}
	return ret;
}

SubmitTableValues.ConvertTRToParameters.Clone
=
function( obj )
{
	var ret = {};

	for ( var name in obj )
	{
		var value = obj[name];
		ret[name] = obj[name];
	}

	return ret;
}

SubmitTableValues.Finish
=
function( responseText )
{
	alert( "Finished submitting table values." );
}

function Validate( event, handler )
{
	var valid  = true;
	var form   = event.target;
	var n      = form.elements.length;

	var del = (form.elements['submit'] && ('delete' == form.elements['submit'].value));

	if ( ! del )
	{
		valid = Forms.ValidateForm( form );

		/*
		form.checkValidity();
		
		for ( var i=0; i < n; i++ )
		{
			var element   = form.elements[i];

			if ( element.hasAttribute( "required" ) )
			{
				var type      = element.type;
				var name      = element.name;
				var value     = element.value;
				var validated = element.validity.valid;

				Validate.AddClass( element, "checked" );

				if ( (false === validated) || (('hidden' == type) && (0 == value)) )
				{
					valid = false;
				}
				else
				{

				}
			}
		}
		*/
	}

	if ( valid && handler )
	{
		handler( event );
	}
	else
	{
		alert( "Please complete the form before submitting." );
	}
	
	return false;
}

function ValidateForm( form )
{
	var valid = true;
	var n     = form.elements.length;

	form.checkValidity();
		
	for ( var i=0; i < n; i++ )
	{
		var element = form.elements[i];

		if ( element.hasAttribute( "required" ) )
		{
			var type      = element.type;
			var name      = element.name;
			var value     = element.value.trim();
			var validated = element.validity.valid;

			Validate.AddClass( element, "checked" );

			if ( "" == value )
			{
				valid = false;
			}
			else
			if ( (false === validated) || (('hidden' == type) && (0 == value)) )
			{
				valid = false;
			}
		}
	}

	return valid;
}

Validate.Submit
=
function( event )
{
	event.preventDefault();

	Forms.Validate( event, Forms.Submit );
}

function WordLimit( elements )
{
	var n = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var e = elements[i];
	
		if ( ("TEXTAREA" == e.tagName) && e.hasAttribute( "data-limit" ) )
		{
			e.oninput  = WordLimit.OnInput;
		}
	}
}

WordLimit.OnInput
=
function( event )
{
	var textarea  = event.target;
	var limit     = textarea.getAttribute( "data-limit" );
	var target_id = textarea.getAttribute( "data-target" );
	var target    = target_id ? document.getElementById( target_id ) : null;
	var last_char = WordLimit.LastChar  ( textarea.value );
	var words     = WordLimit.CountWords( textarea.value );
	var truncated = false;
	
	if ( limit < words )
	{
		textarea.value = WordLimit.TruncateTextToWords( textarea.value, limit );

		words = WordLimit.CountWords( textarea.value );

		truncated = true;
	}

	if ( truncated )
	{
		switch ( last_char )
		{
		case  " ":
		case "\n":
			alert( "Warning, your have reached the word limit!" );
		}
	}

	if ( target ) target.innerHTML = (words) + " words";
}

WordLimit.CountWords
=
function( value )
{
	return value.split( " " ).length;
}


WordLimit.TruncateTextToWords
=
function( value, limit )
{
	var words     = 0;
	var i         = -1;
	
	while ( -1 != (i = WordLimit.NextWhitespace( value, i + 1 )) )
	{
		words++;

		if ( limit < words ) break;
	}

	if ( -1 == i ) i = value.length;

	return value.substring( 0, i );
}

WordLimit.LastChar
=
function( value )
{
	return value.length ? value.substring( value.length - 1, value.length ) : null;
}


WordLimit.NextWhitespace
=
function( value, i )
{
	var s = value.indexOf(  " ", i );
	var n = value.indexOf( "\n", i );
	var r = -1;

	if ( (-1 != s) && (-1 != n) )
	{
		r = Math.min( s, n );
	}
	else
	if ( -1 != s )
	{
		r = s;
	}
	else
	if ( -1 != n )
	{
		r = n;
	}

	return r;
}

GetFormValues.ConvertTableToJSON
=
function( table_id )
{
	var tuples = new Array();
	var table = document.getElementById( table_id );

	if ( table )
	{
		var rows   = table.getElementsByTagName( "TR" );
		var n      = rows.length;
		
		for ( var i=0; i < n; i++ )
		{
			var tuple = new Object();
			var row   = rows[i];
			
			var fields = row.getElementsByTagName( "TD" );
			var m      = fields.length;
		
			for ( var j=0; j < m; j++ )
			{
				var field = fields[j];

				if ( field.hasAttribute( "data-name" ) )
				{
					var key   = field.getAttribute( "data-name" );
					var value = field.innerHTML.trim();
					
					tuple[key] = value;
				}
			}
			
			tuples.push( tuple );
		}
	}
	
	return JSON.stringify( tuples );
}

GetFormValues.IsTimeComponent
=
function( name )
{
	return (-1 !== name.indexOf( "_hour" ));
}

GetFormValues.GetTimePrefix
=
function( name )
{
	var index = name.indexOf( "_hour" );
	
	return name.substring( 0, index );
}

GetFormValues.ExtractTime
=
function( form, key )
{
	var ret         = "";
	var key_hour    = key + "_hour";
	var key_minutes = key + "_minutes";
	var key_seconds = key + "_seconds";

    ret += form.elements[key_hour]    ? form.elements[key_hour   ].value : "00";
    ret += ":";
	ret += form.elements[key_minutes] ? form.elements[key_minutes].value : "00";
    ret += ":";
    ret += form.elements[key_seconds] ? form.elements[key_seconds].value : "00";

	return ret;
}

GetFormValues.ConvertDateToMySQLDateFormatFrom
=
function( date_value, date_format )
{
    var converted = "0000-00-00";

    var delimiter = (-1 != date_value.indexOf( "/" )) ? "/" : "-";
    var bits      = date_value.split( delimiter );

    if ( 3 == bits.length )
    {
        var yy = "";
        var mm = "";
        var dd = "";

        switch ( date_format )
        {
        case "DD-MM-YY":
        case "DD/MM/YY":
        case "DD-MM-YYYY":
        case "DD/MM/YYYY":
            dd = bits[0];
            mm = bits[1];
            yy = bits[2];
            break;

        case "MM-DD-YY":
        case "MM/DD/YY":
        case "MM-DD-YYYY":
        case "MM/DD/YYYY":
            mm = bits[0];
            dd = bits[1];
            yy = bits[2];
            break;

        case "YY-MM-DD":
        case "YYYY-MM-DD":
        default:
            yy = bits[0];
            mm = bits[1];
            dd = bits[2];
        }

        var year = parseInt( yy )

        if ( !isNaN( year ) && (year < 100) )
        {
            yy = (year < 50) ? 2000 + year : 1900 + year;
        }

        converted = "" + yy + "-" + GetFormValues.ZeroPad( mm ) + "-" + GetFormValues.ZeroPad( dd );
    }

    return converted;
}

GetFormValues.ZeroPad
=
function( value )
{
    var val = parseInt( value );

    if ( isNaN( val ) )
    {
        return "00";
    }
    else
    {
        return (val <= 9) ? "0" + val : "" + val;
    }
}

Validate.HasClass
=
function ( element, cls )
{
	var classes = element.className;
	
	return (-1 != classes.indexOf( cls ));
}

Validate.AddClass
=
function ( element, cls )
{
	if ( element && cls )
	{
		var classes = element.className;
		
		if ( -1 == classes.indexOf( cls ) )
		{
			element.className += (" " + cls);
		}
	}
}

Validate.RemoveClass
=
function ( element, cls )
{
	var classes = element.className;
	var f = 0;
	var n = cls.length;

	if ( (-1 != classes.indexOf( " " + cls )) || (-1 != classes.indexOf( cls + " " )) || (-1 != classes.indexOf( cls )) )
	{
		var f = classes.indexOf( cls );

		if ( (0 < f) && (' ' == classes[f - 1]) ) f--;
	
		element.className = classes.substring( 0, f ) + classes.substring( f + n + 1 );
	}
}

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

/*
 *  PureJavacript, HTMLEntities.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
HTMLEntities        = {}
HTMLEntities.Encode = HTMLEntitiesEncode
HTMLEntities.Decode = DecodeHTMLEntities

/*
 *	The following implementations were copied from the following opensource implementations:
 *	
 *	http://locutus.io/php/strings/htmlentities/
 *	http://locutus.io/php/strings/get_html_translation_table/index.html
 */

function HTMLEntitiesEncode( string, quoteStyle, charset, doubleEncode )
{
	//  discuss at: http://locutus.io/php/htmlentities/
	// original by: Kevin van Zonneveld (http://kvz.io)
	//  revised by: Kevin van Zonneveld (http://kvz.io)
	//  revised by: Kevin van Zonneveld (http://kvz.io)
	// improved by: nobbler
	// improved by: Jack
	// improved by: Rafał Kukawski (http://blog.kukawski.pl)
	// improved by: Dj (http://locutus.io/php/htmlentities:425#comment_134018)
	// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//    input by: Ratheous
	//      note 1: function is compatible with PHP 5.2 and older
	//   example 1: htmlentities('Kevin & van Zonneveld')
	//   returns 1: 'Kevin &amp; van Zonneveld'
	//   example 2: htmlentities("foo'bar","ENT_QUOTES")
	//   returns 2: 'foo&#039;bar'

	var hashMap = HTMLEntitiesEncode.GetHTMLTranslationTable( 'HTML_ENTITIES', quoteStyle )

	string = string === null ? '' : string + ''

	if ( !hashMap )
	{
		return false
	}

	if ( quoteStyle && quoteStyle === 'ENT_QUOTES' )
	{
		hashMap["'"] = '&#039;'
	}

	doubleEncode = doubleEncode === null || !!doubleEncode

	var regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' + Object.keys(hashMap).join('').replace(/([()[\]{}\-.*+?^$|\/\\])/g, '\\$1') + ']','g')

	return string.replace( regex,
		function ( ent )
		{
			if ( ent.length > 1 )
			{
				return doubleEncode ? hashMap['&'] + ent.substr(1) : ent
			}

			return hashMap[ent]
		}
	)
}

function DecodeHTMLEntities( htmlEncodedString )
{
	var ret = htmlEncodedString;

	if ( "string" == typeof htmlEncodedString )
	{
		var bits = htmlEncodedString.split( '&' );
		var n    = bits.length;

		if ( 1 < n )
		{
			for ( var i=0; i < n; i++ )
			{
				var s = bits[i].indexOf( ";" );

				if ( -1 != s )
				{
					var bit = bits[i];
					var bob = bit.substring( 0, s + 1 );

					switch ( bob )
					{
					case "amp;":
						bits[i] = "&"  + bit.substring( s + 1, bit.length );
						break;
						
					case "quot;":
						bits[i] = "\"" + bit.substring( s + 1, bit.length );
						break;

					case "rsquo;":
						bits[i] = "\'" + bit.substring( s + 1, bit.length );
						break;
						
					case "apos;":
						bits[i] = "\'" + bit.substring( s + 1, bit.length );
						break;
						
					case "lt;":
						bits[i] = "<"  + bit.substring( s + 1, bit.length );
						break;
						
					case "gt;":
						bits[i] = ">"  + bit.substring( s + 1, bit.length );
						break;

					default:
						bits[i] = DecodeHTMLEntities.DecodeEntity( bob ) + bit.substring( s + 1, bit.length );
					}
				}
			}
			ret = bits.join( "" );
		}
	}

	return ret;
}

HTMLEntitiesEncode.GetHTMLTranslationTable
=
function( table, quoteStyle )
{
	// eslint-disable-line camelcase
	//  discuss at: http://locutus.io/php/get_html_translation_table/
	// original by: Philip Peterson
	//  revised by: Kevin van Zonneveld (http://kvz.io)
	// bugfixed by: noname
	// bugfixed by: Alex
	// bugfixed by: Marco
	// bugfixed by: madipta
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: T.Wild
	// improved by: KELAN
	// improved by: Brett Zamir (http://brett-zamir.me)
	//    input by: Frank Forte
	//    input by: Ratheous
	//      note 1: It has been decided that we're not going to add global
	//      note 1: dependencies to Locutus, meaning the constants are not
	//      note 1: real constants, but strings instead. Integers are also supported if someone
	//      note 1: chooses to create the constants themselves.
	//   example 1: get_html_translation_table('HTML_SPECIALCHARS')
	//   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

	var entities = {}
	var hashMap = {}
	var decimal
	var constMappingTable = {}
	var constMappingQuoteStyle = {}
	var useTable = {}
	var useQuoteStyle = {}

	// Translate arguments
	constMappingTable[0] = 'HTML_SPECIALCHARS'
	constMappingTable[1] = 'HTML_ENTITIES'
	constMappingQuoteStyle[0] = 'ENT_NOQUOTES'
	constMappingQuoteStyle[2] = 'ENT_COMPAT'
	constMappingQuoteStyle[3] = 'ENT_QUOTES'

	useTable = !isNaN(table)
	? constMappingTable[table]
	: table
	  ? table.toUpperCase()
	  : 'HTML_SPECIALCHARS'

	useQuoteStyle = !isNaN(quoteStyle)
	? constMappingQuoteStyle[quoteStyle]
	: quoteStyle
	  ? quoteStyle.toUpperCase()
	  : 'ENT_COMPAT'

	if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
	throw new Error('Table: ' + useTable + ' not supported')
	}

	entities['38'] = '&amp;'
	if (useTable === 'HTML_ENTITIES')
	{
		entities['160'] = '&nbsp;'
		entities['161'] = '&iexcl;'
		entities['162'] = '&cent;'
		entities['163'] = '&pound;'
		entities['164'] = '&curren;'
		entities['165'] = '&yen;'
		entities['166'] = '&brvbar;'
		entities['167'] = '&sect;'
		entities['168'] = '&uml;'
		entities['169'] = '&copy;'
		entities['170'] = '&ordf;'
		entities['171'] = '&laquo;'
		entities['172'] = '&not;'
		entities['173'] = '&shy;'
		entities['174'] = '&reg;'
		entities['175'] = '&macr;'
		entities['176'] = '&deg;'
		entities['177'] = '&plusmn;'
		entities['178'] = '&sup2;'
		entities['179'] = '&sup3;'
		entities['180'] = '&acute;'
		entities['181'] = '&micro;'
		entities['182'] = '&para;'
		entities['183'] = '&middot;'
		entities['184'] = '&cedil;'
		entities['185'] = '&sup1;'
		entities['186'] = '&ordm;'
		entities['187'] = '&raquo;'
		entities['188'] = '&frac14;'
		entities['189'] = '&frac12;'
		entities['190'] = '&frac34;'
		entities['191'] = '&iquest;'
		entities['192'] = '&Agrave;'
		entities['193'] = '&Aacute;'
		entities['194'] = '&Acirc;'
		entities['195'] = '&Atilde;'
		entities['196'] = '&Auml;'
		entities['197'] = '&Aring;'
		entities['198'] = '&AElig;'
		entities['199'] = '&Ccedil;'
		entities['200'] = '&Egrave;'
		entities['201'] = '&Eacute;'
		entities['202'] = '&Ecirc;'
		entities['203'] = '&Euml;'
		entities['204'] = '&Igrave;'
		entities['205'] = '&Iacute;'
		entities['206'] = '&Icirc;'
		entities['207'] = '&Iuml;'
		entities['208'] = '&ETH;'
		entities['209'] = '&Ntilde;'
		entities['210'] = '&Ograve;'
		entities['211'] = '&Oacute;'
		entities['212'] = '&Ocirc;'
		entities['213'] = '&Otilde;'
		entities['214'] = '&Ouml;'
		entities['215'] = '&times;'
		entities['216'] = '&Oslash;'
		entities['217'] = '&Ugrave;'
		entities['218'] = '&Uacute;'
		entities['219'] = '&Ucirc;'
		entities['220'] = '&Uuml;'
		entities['221'] = '&Yacute;'
		entities['222'] = '&THORN;'
		entities['223'] = '&szlig;'
		entities['224'] = '&agrave;'
		entities['225'] = '&aacute;'
		entities['226'] = '&acirc;'
		entities['227'] = '&atilde;'
		entities['228'] = '&auml;'
		entities['229'] = '&aring;'
		entities['230'] = '&aelig;'
		entities['231'] = '&ccedil;'
		entities['232'] = '&egrave;'
		entities['233'] = '&eacute;'
		entities['234'] = '&ecirc;'
		entities['235'] = '&euml;'
		entities['236'] = '&igrave;'
		entities['237'] = '&iacute;'
		entities['238'] = '&icirc;'
		entities['239'] = '&iuml;'
		entities['240'] = '&eth;'
		entities['241'] = '&ntilde;'
		entities['242'] = '&ograve;'
		entities['243'] = '&oacute;'
		entities['244'] = '&ocirc;'
		entities['245'] = '&otilde;'
		entities['246'] = '&ouml;'
		entities['247'] = '&divide;'
		entities['248'] = '&oslash;'
		entities['249'] = '&ugrave;'
		entities['250'] = '&uacute;'
		entities['251'] = '&ucirc;'
		entities['252'] = '&uuml;'
		entities['253'] = '&yacute;'
		entities['254'] = '&thorn;'
		entities['255'] = '&yuml;'
	}

	if (useQuoteStyle !== 'ENT_NOQUOTES')
	{
		entities['34'] = '&quot;'
	}

	if (useQuoteStyle === 'ENT_QUOTES')
	{
		entities['39'] = '&#39;'
	}
	entities['60'] = '&lt;'
	entities['62'] = '&gt;'

	// ascii decimals to real symbols
	for ( const decimal in entities)
	{
		if (entities.hasOwnProperty(decimal))
		{
			hashMap[String.fromCharCode(decimal)] = entities[decimal]
		}
	}

	return hashMap
}

DecodeHTMLEntities.DecodeEntity
=
function( entity )
{
	var ret = entity;

	if ( 0 == entity.indexOf( "#" ) )
	{
		var entity2 = entity.substring( 1, entity.length );
		var e       = entity2.indexOf( ";" );
	
		if ( (entity2.length - 1) == e )
		{
			var entity3 = entity2.substring( 0, entity2.length - 1 );
			
			var dec = parseInt( entity3 );
			
			if ( NaN !== dec )
			{
				ret = String.fromCharCode( dec );
			}
		}
	}
	
	return ret;
}

/*
 *  PureJavacript, Helper.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function GetTuple( obj )
{
	var tuple = null;

	if ( obj instanceof Array )
	{
		for ( const index in obj )
		{
			tuple = GetTuple( obj[index] );
			break;
		}
	}
	else
	{
		tuple = obj;
	}

	return tuple;
}

function LimitOffsetParameters( json )
{
	var parameters = null;
	var offset     = ("" != json.offset) ? parseInt( json.offset ) : 0;
	var limit      = ("" != json.limit ) ? parseInt( json.limit  ) : 0;
	
	if ( limit )
	{
		parameters        = new Object();
		parameters.limit  = limit;
		parameters.offset = limit + offset;
	}
	
	return parameters;
}

function Object_Get( $object, $member )
{
	if ( $object.hasOwnProperty( $member ) )
	{
		return decodeURI( $object[$member] );
	}
	else
	{
		return "";
	}
}

function Replace( text, array, recode = false )
{
	for ( var member in array )
	{
		var key   = "%" + member + "%";
		var value = recode ? Recode( array[member] ) : array[member];

		while ( -1 != text.indexOf( key ) )
		{
			text = text.replace( key, value );
		}
	}
	return text;
}

function Recode( html_entity_encoded_text )
{
	var decoded = DecodeHTMLEntity( html_entity_encoded_text );
	var encoded = encodeURIComponent( decoded );

	return encoded;
}

function DecodeHTMLEntity( html_entity_encoded_text )
{
	var ret  = html_entity_encoded_text;
	var type = typeof html_entity_encoded_text;

	if ( "string" == type )
	{
		//	Based on:
		//	https://stackoverflow.com/a/29824550
		//
		ret = html_entity_encoded_text.replace(/&#(\d+);/g, function( match, dec ) { return String.fromCharCode(dec); } );
	}
	return ret;
}

/*
 *  PureJavacript, InputFile.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function InputFile( file_id, progress_handler, onload_handler, onerror_handler )
{
	return new InputFile.Class( file_id, progress_handler, onload_handler, onerror_handler );
}

InputFile.Class
=
function ( file_id, progress_handler, onload_handler, onerror_handler )
{
	this.reader            = new FileReader();
	this.reader.onprogress = progress_handler ? progress_handler : InputFile.OnProgress;
	this.reader.onloadend  =  onload_handler ?   onload_handler : InputFile.OnLoad;
	this.reader.onerror    =  onerror_handler ?  onerror_handler : InputFile.OnError;
	this.count             = 0;

	var input = document.getElementById( file_id );
	var file  = input.files[0];

	switch ( input.files[0].type.split( "/" )[1] )
	{
	case "png":
		this.fileType = "png";
		break;
		
	case "jpg":
	case "jpeg":
		this.fileType = "jpg";
		break;

    case "csv":
        this.fileType = "csv";
        break;

	default:
		this.fileType = "";
	}

    /*
     *  Kludge to allow IE browsers to call 'readAsBinaryString', see:
     *  https://stackoverflow.com/questions/31391207/javascript-readasbinarystring-function-on-e11
     */

    if ( FileReader.prototype.readAsBase64 === undefined )
    {
        FileReader.prototype.readAsBase64
        =
        function( file_input )
        {
            this.readAsArrayBuffer( file_input );
        }
    }

    this.reader.onload
    =
    function( e )
    {
        var binary = "";
        var bytes  = new Uint8Array( this.result );
        var length = bytes.byteLength;

        for ( var i=0; i < length; i++ )
        {
            binary += String.fromCharCode( bytes[i] )
        }

        this.resultAsBase64 = Base64.Encode( binary );
    }

    this.reader.readAsBase64( file );
}

InputFile.Class.prototype.getCount
=
function()
{
	return this.count;
}

InputFile.OnProgress
=
function()
{
	console.log( "InputFile: default onprogress handler" );
}

InputFile.OnLoad
=
function()
{
	console.log( "InputFile: default onload handler" );
}

InputFile.OnError
=
function()
{
	console.log( "InputFile: default onerror handler" );
}

/*
 *  PureJavacript, Is.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Is        = {}
Is.Date   = IsDate
Is.Prefix = IsPrefix

function IsDate( $datetime )
{
	var is_date = false;

	switch ( $datetime )
	{
	case null:
	case "NULL":
	case "null":
	case "":
	case "0":
	case "0000-00-00":
	case "0000-00-00 00:00:00":
		break;
		
	default:
		is_date = true;
	}

	return is_date;
}

function IsPrefix( string, prefix )
{
	return (0 == string.indexOf( prefix ));
}

/*
 *  PureJavacript, Links.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Links          = {}
Links.Activate = LinksActivate
Links.Complete = LinksComplete

function LinksActivate( links, href, top_level_links )
{
	var n = links.length;

    if ( !top_level_links ) top_level_links = [];
	
	for ( var i=0; i < n; i++ )
	{
		var link = links[i];

        if ( link.href )
        {
            if ( link.href == href )
            {
                link.className += ("" == link.className) ? "active" : " active";
            }

            //  Top-level link = "/dashboard/"
            //  Menu link      = "/dashbaord/projects/"
            //  Page link      = "/dashboard/projects/current_page/"
            //
            //  If href       = '/dashboard/some/directory/',
            //  and link.href = '/dashboard/some/',
            //
            //  then it should have the class 'subactive' added,
            //  indicating that the link is a parent directory of the current page
            //  unless it is a 'top_level' link.
            //

            var is_prefix    = LinksActivate.IsPrefix( href, link.href );
            var is_tll       = top_level_links.includes( link.href );

            if ( is_prefix && !is_tll )
            {
                link.className += ("" == link.className) ? "subactive" : " subactive";
            }
        }
	}
}

LinksActivate.IsPrefix
=
function( string, prefix )
{
    return (0 === string.indexOf( prefix ));
}

LinksActivate.IsRootHref
=
function( href )
{
    return ((location.protocol + '//') == href);
}

function LinksComplete( links, tuple )
{
	var n = links.length;
	
	for ( var i=0; i < n; i++ )
	{
		var link = links[i];

        if ( link.href )
        {
    		link.href = Replace( link.href, tuple, true );
        }
		link.innerHTML = Replace( link.innerHTML, tuple );
	}
}

/*
 *  PureJavacript, Load.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Load           = {}
Load.ImageFile = LoadInputFromImageFile
Load.Table     = LoadTableFromFile

function LoadInputFromImageFile( targetID, fileID, holderID )
{
	var target = document.getElementById( targetID );
	var file   = document.getElementById( fileID  );
	
	if ( target && file )
	{
		file.imageFile = new InputFile( fileID, null, function() { LoadInputFromImageFileHandler( targetID, fileID, holderID ); }, null );
	}
}

function LoadInputFromImageFileHandler( targetID, fileID, holderID )
{
	var target = document.getElementById( targetID  );
	var file   = document.getElementById( fileID   );
	var holder = document.getElementById( holderID );

	var base64 = file.imageFile.reader.resultAsBase64;
	var ext    = file.imageFile.fileType;
	var url64  = "data:image/" + ext + ";base64," + base64;
	
	target.value = url64.replace( '=', '' );

	if ( holder )
	{
		holder.style.background     = "white url(" + url64 + ") no-repeat center center";
		holder.style.backgroundSize = "cover";

		Class.RemoveClass( holder, "hidden" );
	}
}

function LoadTableFromFile( event )
{
	var table_id = event.target.getAttribute( "data-target-id" );
	var table    = document.getElementById( table_id );
	
	if ( table )
	{
		var id = event.target.id;
		
		LoadTableFromFile.table = table;
		LoadTableFromFile.file  = InputFile( id, null, LoadTableFromFile.OnLoad, null );
	}
}

LoadTableFromFile.OnLoad
=
function()
{
	if ( ! LoadTableFromFile.file )
	{
		console.log( "Unexpectedly, could not find file!" );
	}
	//else
	//if ( "csv" != LoadTableFromFile.file.fileType )
	//{
	//	alert( "Please add a CSV (Comman Seperated Value) file - file of type " + LoadTableFromFile.file.fileType + " selecteed" );
	//
	//	location.reload();
	//}
	else
	{
		var table     = LoadTableFromFile.table;
		var content   = Base64.Decode( LoadTableFromFile.file.reader.resultAsBase64 );
		var csv_file  = new CSVFile( content );
		var col_specs = LoadTableFromFile.ExtractColumnSpecs( LoadTableFromFile.table );
		var tbody     = table.tBodies[0];

		var rows      = csv_file.getNrOfRows();

		if ( 0 < rows )
		{
			tbody.innerHTML = "";
		
			for ( var row=0; row < rows; row++ )
			{
				var tr = document.createElement( "TR" );
				var n  = col_specs.length;
				
				for ( var i=0; i < n; i++ )
				{
					//	Weirdness alert !!!
					//	When assigning from 'value' into 'td.innerHTML' Safari (and possibly other browsers)
					//	will html entity encode characters such as ampersands that are in 'value'.
					//	To ensure that this always happens, 'td.innerHTML' is then passed to the function
					//	'HTMLEntitiesEncode', which will encode any entities that were not automatically
					//	converted by the browser. Note, the fourth parameter of 'HTMLEntitiesEncode' is
					//	false, which prevents already encoded entities from being re-encoded.
					//	Therefore, this kind of makes it impossible to use this Load.Table mechanism
					//	to load values that contain html entities that need to be preserved, i.e.
					//	&amp; should be converted to '&amp;', 'a', 'm', 'p', ';'.

					var spec           = col_specs[i];
					var td             = document.createElement( "TD" );
					var value          = csv_file.getValueFor( row, spec.source_names );
						td.innerHTML   = value;
						td.innerHTML   = HTMLEntitiesEncode( td.innerHTML, 'ENT_QUOTES', 'UTF8', false );
						td.setAttribute( "data-name", spec.field );

					tr.appendChild( td );
				}
			
				tbody.appendChild( tr );
			}
		}
	}
}

LoadTableFromFile.ExtractColumnSpecs
=
function( table )
{
	var col_specs   = new Array();
	var th_elements = table.getElementsByTagName( "TH" );
	var n           = th_elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var th           = th_elements[i];
		var field        = th.getAttribute( "data-field" );
		var source_names = th.getAttribute( "data-source-names" );

		var col_spec                 = new Object();
			col_spec['field']        = field;
			col_spec['source_names'] = source_names.split( "," );

		col_specs.push( col_spec );
	}
	return col_specs;
}

/*
 *  PureJavacript, Locations.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Locations              = {}
Locations.SearchValues = GetSearchValues
Locations.SearchValue  = GetSearchValue
Locations.Up           = Up
Locations.TwoUp        = TwoUp
Locations.CreateDownFn = CreateDownFn
Locations.Down         = Down
Locations.Reload       = Reload

function GetSearchValues()
{
    return GetSearchValues.CreateDictionary( window.location.search );
}

GetSearchValues.CreateDictionary
=
function( url_search_parameters )
{
    var object = new Object;

    if ( 0 < url_search_parameters.length )
    {
        var bits = ('?' == url_search_parameters[0])
                 ? url_search_parameters.substring( 1 ).split( "&" )
                 : url_search_parameters.substring( 0 ).split( "&" );

        var n    = bits.length;
        
        for ( var i=0; i < n; i++ )
        {
            var keyvalue = bits[i].split( "=" );

            if ( 2 == keyvalue.length )
            {
                var key = "";
                var val = "";

                try
                {
                    key = decodeURIComponent( keyvalue[0] );
                    val = decodeURIComponent( keyvalue[1] );
                }
                catch ( err )
                {}

                if ( (null != key) && (null != val) ) object[key] = val;
            }
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

    if ( null == search_parameters )
    {
        loc += location.search;
    }
    else
    {
        loc += "?";

        for ( const key in search_parameters )
        {
            loc += search_parameters[key] + "=" + Recode( GetSearchValue( search_parameters[key] ) ) + "&";
        }
        loc = loc.substring( 0, loc.length - 1 );
    }

	location.assign( loc );
}

function TwoUp( search_parameters )
{
    var loc  = location.protocol + "//" + location.host;
    var bits = location.pathname.split( "/" );
    var path = "";

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
        bits = ("" == bits[bits.length - 1]) ? bits.slice( 0, -3 ) : bits.slice( 0, -2 );
        path = bits.join( "/" ) + "/";
    }

    loc += path;

    if ( null == search_parameters )
    {
        loc += location.search;
    }
    else
    {
        loc += "?";

        for ( const key in search_parameters )
        {
            loc += search_parameters[key] + "=" + Recode( GetSearchValue( search_parameters[key] ) ) + "&";
        }
        loc = loc.substring( 0, loc.length - 1 );
    }

    location.assign( loc );
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

    if ( -1 !== loc.indexOf( '=%' ) )
    {
        var parameters = Locations.SearchValues();
    
        loc = Replace( loc, parameters );
    }

    location.assign( loc );
}

function Reload( ignored )
{
    location.reload();
}

/*
 *  PureJavacript, Menu.js
 *
 *  Copyright 2014 - 2019, CrossAdaptive
 */

function Menu( id )
{
    var element = document.getElementById( id );
    var display = element.getAttribute( "data-display" );

    if ( !display )
    {
        display = "block";
    }

    if ( element.style.display && (display == element.style.display) )
    {
        element.style.display = "none";
        document.removeEventListener( "keyup", Menu.EscHandler );
    }
    else
    {
        element.style.display = display;
        document.addEventListener( "keyup", function( event ) { Menu.EscHandler( event, id ) } );
    }
}

Menu.EscHandler
=
function( event, id )
{
    if ( 27 === event.keyCode )
    {
        var element = document.getElementById( id );
            element.style.display = "none";

        document.removeEventListener( "keyup", Menu.EscHandler );
    }
}

/*
 *  PureJavacript, Modal.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Modal        = {}
Modal.Close  = CloseModals;
Modal.Toggle = ToggleModal;

function CloseModals()
{
	var modal_bg = document.getElementById( "modal-bg" );
	var divs     = document.getElementsByTagName( "DIV" );
	var n        = divs.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( "modal" == divs[i].className )
		{
			var modal = divs[i];
			
			modal.style.display = "none";
		}
	}

	if ( modal_bg ) modal_bg.style.display = "none";
}

function ToggleModal( modal_id )
{
	var modal    = document.getElementById( modal_id   );
	var modal_bg = document.getElementById( "modal-bg" );
	
	if ( modal )
	{
		switch ( modal.style.display )
		{
		case "block":
			modal.style.display    = "none";
			modal_bg.style.display = "none";
			break;
			
		case "none":
		default:
			modal_bg.style.display = "block";

			modal.style.visibility = "hidden";
			modal.style.display    = "block";

			var width = modal.offsetWidth;
				width = width / 2;
				width = 1 - width;
		
			modal.style.marginLeft = width + "px";
			
			modal.style.visibility = "visible";
		}
	}
}

/*
 *  PureJavacript, Selects.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function Selects( resolver )
{
	Selects.resolver = resolver;
	Selects.setup();
}

Selects.setup
=
function()
{
	var kinds = Array();
	var selects = document.getElementsByTagName( "SELECT" );
	if ( selects )
	{
		var n = selects.length;
		
		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
				select.setValue = Selects.setValue;

			var id   = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind = select.getAttribute( "data-kind" );

			if ( kind )
			{
				var cupid = id + kind;

				kinds.push( cupid );
			}
		}
	}

	if ( kinds.length )
	{
		Selects.Multiselect( Selects.ArrayToString( kinds ), "", Selects.setup.handler );
	}
}

Selects.setup.handler
=
function( responseText )
{
    var obj = typeof responseText === 'string' || responseText instanceof String ? JSON.parse( responseText ) : responseText;

	if ( obj && obj.results )
	{
		var lists = Array();
		var n = obj.results.length;
			
		for ( var i=0; i < n; i++ )
		{
			var list   = obj.results[i];
			var name   = list.name;
			var tuples = list.tuples;
			
			lists[name] = tuples;
		}
		Selects.setup.init( lists );
	}
}

Selects.setup.init
=
function( lists )
{
	var selects = document.getElementsByTagName( "SELECT" );

	if ( selects )
	{
		var n = selects.length;
		
		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
			var id     = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind   = select.getAttribute( "data-kind" );
			
			if ( kind && lists.hasOwnProperty( id + kind ) )
			{
				Selects.setup.addOptions( select, lists );
			}
		}

		for ( var i=0; i < n; i++ )
		{
			var select = selects[i];
			var id     = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
			var kind   = select.getAttribute( "data-kind" );

			select.addEventListener( "change", Selects.SetSelected );
			
			if ( kind && lists.hasOwnProperty( id + kind ) )
			{
				if ( select.hasAttribute( "data-cascade" ) )
				{
					select.addEventListener( "change", Selects.Cascade );

					if ( select.hasAttribute( "data-value" ) )
					{
						Selects.DoCascade( select );
					}
				}
			}
		}
	}
}

Selects.setup.addOptions
=
function( select, lists )
{
	var id           = select.hasAttribute( "id" ) ? select.getAttribute( "id" ) + ":" : "";
	var kind         = select.getAttribute( "data-kind" );
	var type         = select.getAttribute( "data-select-type" );
	var tuples       = lists[id + kind];
	
	if ( tuples )
	{
		select.options.length = 0;

		var offset   = 0;
		var selected = 0;
		var label    = select.getAttribute( "data-label"  ) ? select.getAttribute( "data-label"  ) : select.getAttribute( "placeholder" );
		if ( label )
		{
			select.options[0] = new Option( label, '' );
			offset++;
		}

		//if ( ! select.disabled )
		{
			var data_value = select.getAttribute( "data-value" );
			var data_text  = select.getAttribute( "data-text"  );

			var n = tuples.length;
			for ( var i=0; i < n; i++ )
			{
				var disabled = false;
				var name     = tuples[i].name;
				var text     = DecodeHTMLEntities( tuples[i].text );
					text     = text ? text : "";

				if ( 0 == name.indexOf( "!" ) )
				{
					disabled = true;
					name = name.substring( 1 );
				}

				if ( name == data_value               ) selected = i+offset;
				if ( -1 !== text.indexOf( data_text ) ) selected = i+offset;

				if ( name != text )
				{
					select.options[i+offset] = new Option( text, name );
				}
				else
				{
					select.options[i+offset] = new Option( text );
				}
				select.options[i+offset].disabled = disabled;
			}

			select.selectedIndex = selected;
		}
		
		if ( ("progressive" == type) && (0 < selected) )
		{
			for ( var i=selected - 1; i >= 0; i-- )
			{
				select.options[i].disabled = true;
			}
		}
	}
}

Selects.lookupOptions
=
function( id, kind, value )
{
	var select = document.getElementById( id );
	
	if ( select )
	{
		var n = select.length;

		if ( 0 < n )
		{
			for ( var i=0; i < n; i++ )
			{
				if ( select.options[i].value == value )
				{
					select.selectedIndex = i;
					break;
				}
			}
		}
		else
		{
			select.setAttribute( "data-value", value );
		}
	}
}

Selects.Cascade
=
function( event )
{
	Selects.DoCascade( event.target );
}

Selects.DoCascade
=
function( select )
{
	var value   = select.value;
	var targets = select.getAttribute( "data-cascade" );

	if ( targets )
	{
		var bits    = targets.split( "," );
		var n       = bits.length;
		
		for ( var i=0; i < n; i++ )
		{
			var target = bits[i];
			
			if ( target )
			{
				Selects.Reload( target, value );
			}
		}
		
		select.addEventListener( "change", Selects.Cascade );
		//select.onchange = Selects.Cascade;
	}
}

Selects.Reload
=
function( target, value )
{
	var select = document.getElementById( target );
	if ( select )
	{
		if ( "SELECT" == select.tagName )
		{
			var kind = select.getAttribute( "data-kind" );
			
			Selects.Multiselect( target + ":" + kind, value, Selects.setup.handler );

			//if ( value ) select.disabled = false;
		}
		else
		{
			if ( select.reload )
			{
				select.reload( value );
			}
		}
	}
}

Selects.Multiselect
=
function( kinds, value, handler )
{
	var search            = GetSearchValues();
    var parameters        = new Object();
    	parameters.kinds  = kinds;
        parameters.filter = value ? value : search.filter ? search.filter : "";
        parameters.json   = JSON.stringify( search );

	var api_host = Selects.resolver();

	Call( api_host + "/api/multiselect/", parameters, handler );
}

Selects.SetValue
=
function( id, value )
{
	var select = document.getElementById( id );

	select.setValue( value );
}

Selects.setValue
=
function( value )
{
	if ( this )
	{
		var n = this.length;

		if ( 0 < n )
		{
			for ( var i=0; i < n; i++ )
			{
				if ( this.options[i].value == value )
				{
					this.selectedIndex = i;
					break;
				}
			}

			Selects.DoCascade( this );
		}
		else
		{
			this.setAttribute( "data-value", value );
		}

		Selects.SetSelectedClass( this );
	}
}

Selects.SetSelected
=
function( event )
{
	var select = event.target;

	Selects.SetSelectedClass( select );
}

Selects.SetSelectedClass
=
function( select )
{
	if ( 0 == select.selectedIndex )
	{
		Class.RemoveClass( select, "selected" );
	} else {
		Class.AddClass   ( select, "selected" );
	}
}

Selects.ArrayToString
=
function( array )
{
	var string = "";
	var sep    = "";

	for ( var i in array )
	{
		string += sep + array[i];
		sep = ",";
	}
	
	return string;
}

/*
 *  PureJavacript, Session.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function Session( Redirect )
{
	Session.Redirect = Redirect;

	Call( "/api/auth/session/", {}, Session.Switch );
}

Session.Switch
=
function( responseText )
{
	Session.Handler( responseText );

	if ( 'function' === typeof Session.CustomHandler )
	{
		Session.CustomHandler( responseText );
	}

	if ( Session.Redirect )
	{
		Session.Redirect( Session.idtype );
	}
}

Session.Handler
=
function ( responseText )
{
	var idtype = "";

	Session.idtype = "";

	if ( -1 != responseText.indexOf( "UNAUTHENTICATED" ) )
	{
		Session.status = "UNAUTHENTICATED";
	}
	else
	if ( -1 != responseText.indexOf( "INVALID_SESSION" ) )
	{
		Session.status = "INVALID_SESSION";
	}
	else
	if ( "" != responseText )
	{
		var obj = JSON.parse( responseText );
		if ( obj && obj.idtype )
		{
			Session.email       = obj.email;
			Session.idtype      = obj.idtype;
			Session.given_name  = obj.given_name;
			Session.family_name = obj.family_name;
			Session.user_hash   = obj.user_hash;
			Session.read_only   = obj.read_only;
			Session.status      = "AUTHENTICATED";

			idtype = Session.idtype;
		}
		else
		if ( obj && obj.results && (1 == obj.results.length) && obj.results[0].idtype )
		{
			var obj = obj.results[0];

			Session.email       = obj.email;
			Session.idtype      = obj.idtype;
			Session.given_name  = obj.given_name;
			Session.family_name = obj.family_name;
			Session.user_hash   = obj.user_hash;
			Session.read_only   = obj.read_only;
			Session.status      = "AUTHENTICATED";

			idtype = Session.idtype;
		}
		else
		if ( obj && obj.error )
		{
			Session.status = obj["error"];
		}
	}

	//Redirect( idtype );
}

/*
 *  PureJavacript, Setup.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

function Setup()
{
	Setup.Elements( document.getElementsByTagName( "DIV"   ) );
	Setup.Elements( document.getElementsByTagName( "FORM"  ) );
	Setup.Elements( document.getElementsByTagName( "TBODY" ) );
}

Setup.CreateTableSetupFn
=
function( id, nr_columns, clear )
{
    var path   = "";
    var search = "";

    if ( undefined === clear ) clear = false;

    return Setup.CreateTableSetupWithDownFn( id, nr_columns, path, search, clear );
}

Setup.CreateTableSetupWithDownFn
=
function( id, nr_columns, path, search, clear )
{
    if ( undefined === clear ) clear = false;

    /*
     *  The returned function parses the JSON formatted response text and creates a table row template for each result tuple.
     *  These are added to the tbody corresponding to 'id' - 'nr_of_columns' is used if no result tuples are returned.
     */

    var fn
    =
    function( responseText )
    {
        var json  = typeof responseText === 'string' || responseText instanceof String ? JSON.parse( responseText ) : responseText;
        var tbody = document.getElementById( id );

        if ( tbody && ("OK" == json.status) )
        {
            var htm  = Setup.CreateTableSetupFn.RetrieveTemplate( id );
            var htm2 = Setup.CreateTableSetupFn.RetrieveTemplate( id + "-tally" );
            var htm3 = Setup.CreateTableSetupFn.RetrieveTemplate( id + "-summary" );

            if ( ! htm )
            {
                alert( "Table '" + id + "' is missing a row template with the id: '" + id + "-template'" );
            }
            else
            {
                var n      = json.results.length;
                var offset = parseInt( tbody.getAttribute( "data-offset" ) );
                    offset = isNaN( offset ) ? 0 : offset;

                var limit  = parseInt( tbody.getAttribute( "data-limit"  ) );
                    limit  = isNaN( limit ) ? 0 : limit;

                if ( (0 == n) && (0 == offset) )
                {
                    var tr = document.createElement( "TR" );
                        tr.innerHTML = "<td colspan='" + nr_columns + "'>No entries added.</td>";

                    Setup.Clear( tbody );

                    tbody.appendChild( tr );
                }
                else
                {
                    if ( clear ) Setup.Clear( tbody );

                    if ( n != limit )
                    {
                        var load_more = document.getElementById( "tbody-load-more" );
                        if ( load_more ) load_more.style.display = "none";
                    }

                    var T = { t: null };

                    var loading = tbody.querySelector( "TR.loading" );
                    if ( loading )
                    {
                        tbody.removeChild( loading )
                    }
                    else
                    {
                        var rows = tbody.querySelectorAll( "TR" );

                        if ( 0 < rows.length )
                        {
                            var tds = rows[0].querySelectorAll( "TD" );

                            if ( (0 < tds.length) && (-1 != tds[0].innerHTML.toLowerCase().indexOf( "loading" ) ) )
                            {
                                tbody.removeChild( rows[0] );
                            }
                        } 
                    }
                    
                    for ( var i=0; i < n; i++ )
                    {
                        var e = document.createElement( "TR" );
                        var t = json.results[i];
                            t['i'] = i + 1;

                        Setup.CreateTableSetupFn.AddT( T, t );

                        if ( t.hasOwnProperty( "results_set_type" ) && ("summary" == t.results_set_type) )
                        {
                            e.innerHTML = Replace( htm3, t );
                        }
                        else
                        {
                            e.innerHTML = Replace( htm, t );

                            if ( path )
                            {
                                e.style.cursor = "pointer";
                                e.onclick      = Locations.CreateDownFn( Replace( path, t, true ), Replace( search, t, true ) );
                                e.className    = "clickable";
                            }
                        }
                        
                        if ( 0 == (i % 2) )
                        {
                            e.className += " alternate"
                        }

                        if ( "css_class" in t )
                        {
                            e.className += " " + t['css_class'];
                        }

                        tbody.appendChild( e );
                    }

                    if ( htm2 && T.t )
                    {
                        var e = document.createElement( "TR" );
                            e.innerHTML = Replace( htm2, T.t );

                        tbody.appendChild( e );
                    }
                }
            }
        }
    }
    
    return fn;
}

Setup.CreateTableSetupFn.RetrieveTemplate
=
function( id )
{
    var htm             = "";
    var row_template_id = id + "-template";
    var template_tr     = document.getElementById( row_template_id );

    if ( template_tr )
    {
        htm = template_tr.innerHTML;
    }
    
    return htm;
}

Setup.CreateTableSetupFn.RetrieveTemplateParameters
=
function( id )
{
    var parameters      = "";
    var row_template_id = id + "-template";
    var template_tr     = document.getElementById( row_template_id );

    if ( template_tr.hasAttribute( "data-parameters" ) )
    {
        parameters = template_tr.getAttribute( "data-parameters" );
    }
    
    return parameters;
}

Setup.CreateTableSetupFn.AddT
=
function( T, t )
{
    if ( null == T.t )
    {
        T.t = Setup.CreateTableSetupFn.AddT.Clone( t );

        for ( var key in T.t )
        {
            if ( isNaN( T.t[key] ) ) T.t[key] = "";
        }
    }
    else
    {
        for ( var key in T.t )
        {
            if ( !isNaN( T.t[key] ) && !isNaN( t[key] ) )
            {
                T.t[key] = parseInt( T.t[key] ) + parseInt( t[key] );
            }
        }
    }
}

Setup.CreateTableSetupFn.AddT.Clone
=
function( obj )
{
    var ret = {};

    for ( var name in obj )
    {
        var value = obj[name];
        ret[name] = obj[name];
    }

    return ret;
}

Setup.CreateTableSetupWithClickFn
=
function( id, nr_columns, click_fn )
{
    /*
     *  The returned function parses the JSON formatted response text and creates a table row template for each result tuple.
     *  These are added to the tbody corresponding to 'id' - 'nr_of_columns' is used if no result tuples are returned.
     */

    var fn
    =
    function( responseText )
    {
        var json  = JSON.parse( responseText );
        var tbody = document.getElementById( id );
        var more  = tbody.getAttribute( "data-more" );

        if ( tbody && ("OK" == json.status) )
        {
            var htm  = Setup.CreateTableSetupFn.RetrieveTemplate( id );
            var htm2 = Setup.CreateTableSetupFn.RetrieveTemplate( id + "-tally" );
            var htm3 = Setup.CreateTableSetupFn.RetrieveTemplate( id + "-summary" );

            var parameters = Setup.CreateTableSetupFn.RetrieveTemplateParameters( id );

            if ( ! htm )
            {
                alert( "Table '" + id + "' is missing a row template with the id: '" + id + "-template'" );
            }
            else
            {
                var n      = json.results.length;
                var offset = parseInt( json.offset );
                    offset = isNaN( offset ) ? 0 : offset;

                var limit  = parseInt( json.limit );
                    limit  = isNaN( limit ) ? 0 : limit;

                if ( (0 == n) && (0 == offset) )
                {
                    var tr = document.createElement( "TR" );
                        tr.innerHTML = "<td colspan='" + nr_columns + "'>No entries added.</td>";

                    Setup.Clear( tbody );

                    tbody.appendChild( tr );
                }
                else
                {
                    if ( more )
                    {
                        var count  = json.results[0].count;
                        var button = document.getElementById( more );

                        if ( button )
                        {
                            button.setAttribute( "data-limit", limit );
                            button.setAttribute( "data-offset", offset + limit );

                            if ( offset + n < count )
                            {
                                Class.RemoveClass( button, "hidden" );
                            }
                            else
                            {
                                Class.AddClass( button, "hidden" );
                            }
                        }
                    }

                    var T = { t: null };

                    var loading = tbody.querySelector( "TR.loading" );
                    if ( loading )
                    {
                        tbody.removeChild( loading )
                    }
                    else
                    {
                        var rows = tbody.querySelectorAll( "TR" );

                        if ( 0 < rows.length )
                        {
                            var tds = rows[0].querySelectorAll( "TD" );

                            if ( (0 < tds.length) && (-1 != tds[0].innerHTML.toLowerCase().indexOf( "loading" ) ) )
                            {
                                tbody.removeChild( rows[0] );
                            }
                        } 
                    }
                    
                    for ( var i=0; i < n; i++ )
                    {
                        var e = document.createElement( "TR" );
                        var t = json.results[i];
                            t['i'] = i + 1;

                        Setup.CreateTableSetupFn.AddT( T, t );

                        if ( parameters )
                        {
                            e.setAttribute( "data-parameters", Replace( parameters, t ) );
                        }

                        if ( t.hasOwnProperty( "results_set_type" ) && ("summary" == t.results_set_type) )
                        {
                            e.innerHTML = Replace( htm3, t );
                        }
                        else
                        {
                            e.innerHTML = Replace( htm, t );

                            if ( click_fn )
                            {
                                e.style.cursor = "pointer";
                                e.onclick      =  click_fn;
                                e.className    = "clickable";
                            }
                        }
                        
                        if ( 0 == (i % 2) )
                        {
                            e.className += " alternate"
                        }

                        if ( "css_class" in t )
                        {
                            e.className += " " + t['css_class'];
                        }

                        tbody.appendChild( e );
                    }

                    if ( htm2 && T.t )
                    {
                        var e = document.createElement( "TR" );
                            e.innerHTML = Replace( htm2, T.t );

                        tbody.appendChild( e );
                    }
                }
            }
        }
    }
    
    return fn;
}

Setup.CreateFormSetupFn
=
function( id, key_field )
{
    var fn
    =
    function( responseText )
    {
        InsertResponseValues( id, key_field, responseText )
    }

    return fn;
}

Setup.CreateDivSetupFn
=
function( id )
{
    var fn
    =
    function( responseText )
    {
        var div = document.getElementById( id )
        
        if ( div )
        {
            var json = typeof responseText === 'string' || responseText instanceof String ? JSON.parse( responseText ) : responseText;
            
            if ( ("OK" == json.status) && (1 == json.results.length) )
            {
                div.innerHTML = Replace( div.innerHTML, json.results[0] )
                div.style.opacity = "1.0"
            }
            else
            {
                alert( "An unexpected error occurred while retrieving data" )
            }
        }
    }
    
    return fn;
}

Setup.CreateMultiDivSetupFn
=
function( id )
{
    var fn
    =
    function( responseText )
    {
        var div  = document.getElementById( id                     );
        var t    = document.getElementById( id + "-template"       );
        var et   = document.getElementById( id + "-empty-template" );

        var more = div.getAttribute( "data-more" );
        var type =   t.getAttribute( "data-type" );

        if ( div && t )
        {
            var json = JSON.parse( responseText )

            if ( "ERROR" == json.status )
            {
                alert( "An unexpected error occurred while retrieving data" );
            }
            else
            {
                var cls    = t.className; 
                var n      = json.results.length;
                var offset = parseInt( json.offset );
                    offset = isNaN( offset ) ? 0 : offset;

                var limit  = parseInt( json.limit );
                    limit  = isNaN( limit ) ? 0 : limit;

                if ( 0 == n )
                {
                    if ( et )
                    {
                        var type            = type ? type : "DIV";
                        var child           = document.createElement( type );
                            child.className = cls;
                            child.innerHTML = et.innerHTML;

                        div.appendChild( child );
                    }
                }
                else
                if ( (0 == n) && (0 == offset) )
                {
                    // Ignore for now.
                }
                else
                {
                    if ( more )
                    {
                        var count  = json.results[0].count;
                        var button = document.getElementById( more );

                        if ( button )
                        {
                            button.setAttribute( "data-limit", limit );
                            button.setAttribute( "data-offset", offset + limit );

                            if ( offset + n < count )
                            {
                                Class.RemoveClass( button, "hidden" );
                            }
                            else
                            {
                                Class.AddClass( button, "hidden" );
                            }
                        }
                    }

                    for ( var i=0; i < n; i++ )
                    {
                        var type            = type ? type : "DIV";
                        var child           = document.createElement( type );
                            child.className = cls;
                            child.innerHTML = Replace( t.innerHTML, json.results[i] );

                        div.appendChild( child );
                    }
                }
            }
        }
    }
    
    return fn;
}

Setup.CreateFormHandlerFn
=
function( id, handler, parameter )
{
    var fn
    =
    function( responseText )
    {
        if ( ! responseText )
        {
            setTimeout( function() { handler( parameter ) }, 1000 );
        }
        else
        {
            var json = JSON.parse( responseText );

            if ( json && ("ERROR" == json.status) )
            {
                alert( json.error );
            }
            else
            {
                handler( parameter );
            }
        }
    }
    
    return fn;
}

Setup.CreateFormFinalFn
= function( form_id, key, handler )
{
    var fn
    =
    function( responseText )
    {
        var url      = document.getElementById( form_id ).getAttribute( "data-final-url" );
        var response = JSON.parse( responseText );

        if ( "ERROR" == response.status )
        {
            alert( response.error );
        }
        else
        if ( !url )
        {
            alert( "Missing --data-final-url for form with id: " + form_id );
        }
        else
        if ( response.results && response.results[0] )
        {
            var first = response.results[0];
            var parameters = {};
                parameters[key] = first[key];

            Call( url, parameters, null );

            window.setTimeout( handler, 1000 );
        }
    }
    return fn;
}

Setup.More
=
function( event )
{
    var button    = event.target;
    var target_id = button.getAttribute( "data-target" );
    var target    = document.getElementById( target_id );

    if ( !target )
    {
        alert( "Error, could not find target for Setup.More" );
    }
    else
    {
        var offset   = button.getAttribute( "data-offset"    );
        var endpoint = target.getAttribute( "data-setup-url" );

        var parameters        = Locations.SearchValues();
            parameters.offset = offset;

        Call( endpoint, parameters, target.setup );
    }

    return false;
}

Setup.Elements
=
function( elements )
{
	var n = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var element    = elements[i];
		var parameters = GetSearchValues();
        var parameters = Setup.AddSelectCookies( parameters );

		Setup.Element( element, parameters );
	}
}

Setup.Element
=
function( element, parameters )
{
	if ( element && element.hasAttribute( "data-setup-url" ) )
	{
		var url        = element.getAttribute( "data-setup-url" );
		var handler    = Setup.DefaultHandler;

		if ( element.hasOwnProperty( "setup" ) )
		{
			handler = element.setup;

			handler = handler ? handler : element.handler;
		}

		if ( !parameters.target_id && element.hasAttribute( "id" ) )
		{
			parameters.target_id = element.getAttribute( "id" );
		}

		Call( Resolve() + url, parameters, handler );
	}
    else
    if ( "FORM" == element.tagName )
    {
        var fakeResponseText = '{"status":"OK","results":[{}]}';

        InsertResponseValues( element.id, null, fakeResponseText );
    }
}

Setup.DefaultHandler
=
function( responseText )
{
	var json = JSON.parse( responseText );
	
	if ( "OK" != json.status )
	{
		console.log( responseText );
	}
}

Setup.AddSelectCookies
=
function( parameters )
{
    var selects = document.getElementsByTagName( "SELECT" );
    var n       = selects.length;

    for ( var i=0; i < n; i++ )
    {
        var s = selects[i];

        if ( true == s.hasAttribute( "data-cookie" ) )
        {
            var name  = s.name;
            var value = GetCookie( name );

            parameters[name] = value;

            if ( ! s.hasAttribute( "data-value" ) )
            {
                s.setAttribute( "data-value", value );
            }
        }
        else
        if ( true == s.hasAttribute( "data-local" ) )
        {
            var select = s;
            var path   = location.pathname;
            var name   = select.name;
            var key    = name + "|" + path;

            if ( Session.user_hash )
            {
                key = Session.user_hash + "|" + name + "|" + path;
            }

            if ( DataStorage.Local.HasItem( key ) )
            {
                var value = DataStorage.Local.GetItem( key )

                parameters[name] = value;

                if ( ! s.hasAttribute( "data-value" ) )
                {
                    s.setAttribute( "data-value", value );
                }
            }
        }
    }

    return parameters;
}

Setup.Clear
=
function( container )
{
    //  Need to remove from back to maintain
    //  order of children.

    var n = container.children.length - 1;
    
    for ( var i = n; 0 <= i; i-- )
    {
        var child = container.children[i];

        switch ( child.tagName )
        {
        case "DIV":
        case "TR":
            if ( -1 == child.id.toLowerCase().indexOf( "template" ) )
            {
                container.removeChild( child );
            }
            break;
        }
    }
}

Setup.Download
=
function( event )
{
    var link         = event.target;
    var id           = link.id;
    var converter_fn = link.converter;
    var type         = link.getAttribute( "data-content-type"  );
    var url          = link.getAttribute( "data-download-url"  );
    var name         = link.getAttribute( "data-download-name" );
    var params       = link.hasAttribute( "data-download-parameters" )
                     ? GetSearchValues.CreateDictionary( link.getAttribute( "data-download-parameters" ) )
                     : Locations.SearchValues();

    event.preventDefault();

    params.submit    = name ? name : "";
    params.target_id = id;

    link.removeEventListener( 'click', Setup.Download );
    link.onclick = null;

    Call
    (
        url,
        params,
        Setup.CreateDownloadLinkFn( type, converter_fn )
    );
}

Setup.CreateDownloadLinkFn
=
function( type, converter_fn )
{
    var fn
    =
    function( responseText )
    {
        var response = JSON.parse( responseText );

        if ( "ERROR" == response.status )
        {
            alert( response.error );
        }
        else
        {
            var target_id = response.target_id;
            var name      = response.submit;

            const blob = new Blob
            (
                converter_fn( type, response ),
                { type: type }
            );

            const url = URL.createObjectURL(blob);

            var a      = document.getElementById( target_id );
                a.href = url;

            if ( name )
            {
                a.download = name;
            }

            a.click();
        }
    }
    return fn;
}

/*
 *  PureJavacript, String.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

var
Strings = {}
Strings.EndsWith     = StringEndsWith
Strings.GenerateSalt = StringGenerateSalt
Strings.RandomHex    = StringRandomHex
Strings.StartsWith   = StringStartsWith
Strings.StripUnicode = StringStripUnicode
Strings.Truncate     = StringTruncate

function StringEndsWith( string, suffix )
{
	var n = string.length;
	var s = suffix.length;
	var i = string.indexOf( suffix );

	return (i == (n - s));
}

function StringGenerateSalt()
{
	return Strings.RandomHex( 64 );
}

function StringRandomHex( length )
{
	var array = new Uint8Array( length );

	window.crypto.getRandomValues( array );

	return Array.from( array, StringRandomHex.ToHex ).join( '' );
}

StringRandomHex.ToHex
=
function( decimalValue )
{
	return decimalValue.toString( 16 ).padStart( 2, "0" );
}

function StringStartsWith( string, prefix )
{
    return (0 === string.indexOf( prefix ));
}

function StringStripUnicode( s )
{
	var r = "";
	var l = "";
	var n = s.length;
	
	for ( var i=0; i < n; i++ )
	{
		try {
			if ( s.charCodeAt( i ) <= 255 )
			{
				r += s.charAt( i );
				l += "#";
			}
			else
			{
				l += "U";
			}
		}
		catch (err)
		{}
	}
	
	console.log( l );
	
	return r;
}

function StringTruncate( text, max_length )
{
	if ( text && (text.length > max_length) )
	{
		text = text.substring( 0, max_length - 3 ) + "...";
	}
	return text;
}

