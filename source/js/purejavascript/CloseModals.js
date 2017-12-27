
function CloseModals()
{
	var modal_bg = document.getElementById( "modal-bg" );
	var divs     = document.getElementsByTagName( "DIV" );
	var n        = divs.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( "modal" == divs[i].className )
		{
			var modal = divs[i];
			
			modal.style.display = "none";
		}
	}

	if ( modal_bg ) modal_bg.style.display = "none";
}
