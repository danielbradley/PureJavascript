
function InsertFormValues( form, object )
{
	for ( var member in object )
	{
		var input = form[member];
		var value = object[member];

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
					input.value = value;
				}
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
			}
		}
	}
}