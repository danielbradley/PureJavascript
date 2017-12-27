
function Table( id )
{
	var table = document.getElementById( id );
	
	if ( table )
	{
		this.table = table;

		var field_headers = this.table.getElementsByTagName( "TH" );
		var n             = field_headers.length;
		
		for ( var i=0; i < n; i++ )
		{
			field_headers[i].onclick = Table.prototype.onHeaderClick;
		}
	}
}

Table.prototype.onHeaderClick
=
function( event )
{
	if ( this )
	{
		alert( "This" );
	}
	else
	{
		alert( "That" );
	}
}
