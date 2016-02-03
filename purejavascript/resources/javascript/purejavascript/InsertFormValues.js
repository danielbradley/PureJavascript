
function InsertFormValues( form, object )
{
	for ( var member in object )
	{
		if ( form[member] )
		{
			var input = form[member];
			var value = DecodeHTMLEntities( object[member] );

			if ( input  && value )
			{
				if ( "INPUT" == input.tagName )
				{
					if ( "checkbox" == input.type )
					{
						input.checked = ("1" == value) ? true : false;
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
				else
				if ( "TEXTAREA" == input.tagName )
				{
					value = value.replace( /<br>/g, "\n" );
				
					input.innerHTML = value;
				}
			}
		}
	}
}
