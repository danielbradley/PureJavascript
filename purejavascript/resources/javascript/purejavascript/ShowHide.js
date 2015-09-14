
function ShowHide( id )
{
	var e = document.getElementById( id );
	
	if ( e )
	{
		switch ( e.style.display )
		{
		case "block":
			e.style.display = "none";
			break;
			
		case "none":
			e.style.display = "block";
		}
		
		switch ( e.style.visibility )
		{
		case "visible":
			e.style.visibility = "hidden";
			break;
			
		case "hidden":
			e.style.visibility = "visible";
		}
	}
}
