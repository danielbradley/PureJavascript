
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
