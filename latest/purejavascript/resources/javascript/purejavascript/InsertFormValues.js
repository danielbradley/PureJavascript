
function InsertFormValues( form, object )
{
	for ( var member in object )
	{
		var input = form[member];

		if ( input )
		{
			if ( "INPUT" == input.tagName )
			{
				input.value = object[member];
			}
			else
			if ( "SELECT" == input.tagName )
			{
				input.value = object[member];
			}
		}
	}
}