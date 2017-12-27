
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

