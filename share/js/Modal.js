/*
 *  PureJavacript, Modal.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Modal        = {}
Modal.Close  = CloseModals;
Modal.Toggle = ToggleModal;

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

