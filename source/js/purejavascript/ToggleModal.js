
function ToggleModal( modal_id )
{
	var modal    = document.getElementById( modal_id   );
	var modal_bg = document.getElementById( "modal-bg" );
	
	if ( modal )
	{
		switch ( modal.style.display )
		{
		case "block":
			modal.style.display    = "none";
			modal_bg.style.display = "none";
			break;
			
		case "none":
		default:
			modal_bg.style.display = "block";

			modal.style.visibility = "hidden";
			modal.style.display    = "block";

			var width = modal.offsetWidth;
				width = width / 2;
				width = 1 - width;
		
			modal.style.marginLeft = width + "px";
			
			modal.style.visibility = "visible";
		}
	}
}
