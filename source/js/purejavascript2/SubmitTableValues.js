
function SubmitTableValues( event, verify )
{
	var target_id = event.target.getAttribute( "data-target" );
	var table     = document.getElementById( target_id );
	var endpoint  = table.getAttribute( "data-url" );
	
	if ( table && table.rows && (1 < table.rows.length) )
	{
		var i = SubmitTableValues.NextVerifiedRow( table, verify, 0 );

		if ( i )
		{
			SubmitTableValues.DoCall( endpoint, table, i, verify );
		}
		else
		{
			alert( "Finished submitting table values." );
		}
	}
	else
	{
		Call( "/auth/session/", new Object(), SubmitTableValues.Finish );
	}
	return false;
}

SubmitTableValues.NextVerifiedRow
=
function( table, verify, i )
{
	var j           = false;
	var progress_id = table.getAttribute( "data-progress" );
	var progress    = progress_id ? document.getElementById( progress_id ) : null;

	var loop = true;

	while ( table.rows[++i] )
	{
		if ( progress )
		{
			progress.style.width = (i / table.rows.length) * 100 + "%";
		}

		if ( verify( table.rows[i] ) )
		{
			j = i;
			break;
		}
	}

	if ( progress && ! table.rows[i] )
	{
		progress.style.width = "100%";
	}

	if ( progress && (i == table.rows.length) )
	{
		progress.style.background = "green";
	}

	return j;
}


SubmitTableValues.Handler
=
function( responseText, table, i, verify )
{
	var endpoint = table.getAttribute( "data-url" );
	var json     = JSON.parse( responseText );

	SubmitTableValues.MarkupRow( json, table, i );

	var i = SubmitTableValues.NextVerifiedRow( table, verify, i );

	if ( false !== i )
	{
		SubmitTableValues.DoCall( endpoint, table, i, verify );
	}
	else
	{
		var progress_id = table.getAttribute( "data-progress" );
		var progress    = document.getElementById( progress_id );

			progress.style.width = "100%";

		Call( "/auth/session/", new Object(), SubmitTableValues.Finish );
	}
}

SubmitTableValues.DoCall
=
function( endpoint, table, i, verify )
{
	var parameters = SubmitTableValues.ConvertTRToParameters( table.rows[i] );

	Call
	(
		endpoint,
		parameters,
		function ( responseText )
		{
			var table_copy = table;
			var i_copy     = i;
			var v_copy     = verify;
	 
			SubmitTableValues.Handler( responseText, table_copy, i_copy, v_copy );
		}
	);
}

SubmitTableValues.MarkupRow
=
function( json, table, i )
{
	if ( "OK" == json.status )
	{
		table.rows[i].style.background = "green";
		table.rows[i].style.color      = "white";
	}
	else
	if ( "EXISTS" == json.error )
	{
		table.rows[i].style.background = "#888";
		table.rows[i].style.color      = "#ddd";
	}
	else
	{
		table.rows[i].style.background = "red";
		table.rows[i].style.color      = "white";
	}
}

SubmitTableValues.ConvertTRToParameters
=
function( tr )
{
	var parameters = false;
	var n          = tr.cells.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( "TD" == tr.cells[i].tagName )
		{
			var key = encodeURIComponent( tr.cells[i].getAttribute( "data-name" ) );
			var val = encodeURIComponent( tr.cells[i].innerHTML );
		
			if ( key && val )
			{
				parameters      = parameters ? parameters : new Object();
				parameters[key] = val;
			}
		}
	}
	return parameters;
}

SubmitTableValues.Finish
=
function( responseText )
{
	alert( "Finished submitting table values." );
}
