
function InsertResponseValues( formID, keyName, responseText )
{
	var status     = false;
	var parameters = GetSearchValues();
	
	if ( (null == keyName) || ("" != parameters[keyName]) )
	{
		var json = JSON.parse( responseText );
		var form = document.getElementById( formID );

		if ( json && form && ("OK" == json.status) && (1 == json.results.length) )
		{
			InsertFormValues( form, json.results[0] );

			status = true;
		}
	}
	return status;
}

