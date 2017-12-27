
Dialogs = {}

Dialogs.ShowDialog
=
function( id )
{
	Dialogs.HideDialogs( false );

	var dialog = document.getElementById( id );

	if ( dialog )
	{
		dialog.style.display = "block";

		Dialogs.ShowDialogBackground();
	}
	else
	{
		Dialogs.HideDialogBackground();
	}
}

Dialogs.HideDialogs
=
function( hide_dialog_background = true )
{
	var dialogs = document.getElementsByTagName( "DIALOG" );

	var n = dialogs.length;

	for ( var i=0; i < n; i++ )
	{
		dialogs[i].style.display = "none";
	}

	if ( hide_dialog_background )
	{
		Dialogs.HideDialogBackground();
	}
}

Dialogs.ShowDialogBackground
=
function( id = "dialogs" )
{
	var bg = document.getElementById( id );

	if ( bg )
	{
		bg.style.display = "block";
	}
}

Dialogs.HideDialogBackground
=
function( id = "dialogs" )
{
	var bg = document.getElementById( id );

	if ( bg )
	{
		bg.style.display = "none";
	}
}
