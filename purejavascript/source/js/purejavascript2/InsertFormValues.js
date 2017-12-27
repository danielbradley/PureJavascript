
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
					var ph = input.placeholder;
				
					if ( "checkbox" == input.type )
					{
						input.checked = (("0" == value) || ("" == value)) ? false : true;
					}
					else
					{
						input.value = value;
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
}
