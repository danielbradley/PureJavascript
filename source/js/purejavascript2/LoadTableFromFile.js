
/*
 *	Requires that file input have data-target-id attribute set that specifies the id of the table to be populated.
 *
 *	Target table must have a table head set that for each TH element specifies the following attributes:
 *
 *	data-field: this will be copied into a corresponding TD element as a data-name attribute.
 *	data-source-names: a comma-seperated list of CSV column names that will be searched for to populate the TD.
 */

function LoadTableFromFile( event )
{
	var table_id = event.target.getAttribute( "data-target-id" );
	var table    = document.getElementById( table_id );
	
	if ( table )
	{
		var id = event.target.id;
		
		LoadTableFromFile.table = table;
		LoadTableFromFile.file  = InputFile( id, null, LoadTableFromFile.OnLoad, null );
	}
}

LoadTableFromFile.OnLoad
=
function()
{
	if ( LoadTableFromFile.file )
	{
		var table     = LoadTableFromFile.table;
		var content   = LoadTableFromFile.file.reader.result;
		var csv_file  = new CSVFile( content );
		var col_specs = LoadTableFromFile.ExtractColumnSpecs( LoadTableFromFile.table );
		var tbody     = table.tBodies[0];

		var rows      = csv_file.getNrOfRows();

		if ( 0 < rows )
		{
			tbody.innerHTML = "";
		
			for ( var row=0; row < rows; row++ )
			{
				var tr = document.createElement( "TR" );
				var n  = col_specs.length;
				
				for ( var i=0; i < n; i++ )
				{
					var spec           = col_specs[i];
					var td             = document.createElement( "TD" );
						td.innerHTML   = HTMLEntitiesEncode( csv_file.getValueFor( row, spec.source_names ), 'ENT_QUOTES', 'UTF8', true );
						td.setAttribute( "data-name", spec.field );

					tr.appendChild( td );
				}
			
				tbody.appendChild( tr );
			}
		}
	}
	else
	{
		console.log( "Unexpectedly, could not find file!" );
	}
}

LoadTableFromFile.ExtractColumnSpecs
=
function( table )
{
	var col_specs   = new Array();
	var th_elements = table.getElementsByTagName( "TH" );
	var n           = th_elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var th           = th_elements[i];
		var field        = th.getAttribute( "data-field" );
		var source_names = th.getAttribute( "data-source-names" );

		var col_spec                 = new Object();
			col_spec['field']        = field;
			col_spec['source_names'] = source_names.split( "," );

		col_specs.push( col_spec );
	}
	return col_specs;
}
