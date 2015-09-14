
function InsertFormValues( form, object )
{
	for ( var member in object )
	{
		var input = form[member];

		if ( input )
		{
			if ( "INPUT" == input.tagName )
			{
				if ( "checkbox" == input.type )
				{
					input.checked = "1" == object[member] ? true : false;
				}
				else
				{
					input.value = object[member];
				}
			}
			else
			if ( "SELECT" == input.tagName )
			{
				if ( input.setValue )
				{
					input.setValue( object[member] );
				}
				else
				{
					input.value = object[member];
				}
			}
		}
	}
}