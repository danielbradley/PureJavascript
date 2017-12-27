
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
