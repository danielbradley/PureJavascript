
function InsertResponseValues( formID, keyName, responseText )
{
	var parameters = GetSearchValues();
	
	if ( "" != parameters[keyName] )
	{
		var json = JSON.parse( responseText );
		var form = document.getElementById( formID );

		if ( ("OK" == json.status) && (1 == json.results.length) )
		{
			InsertFormValues( form, json.results[0] );
		}
	}
}

