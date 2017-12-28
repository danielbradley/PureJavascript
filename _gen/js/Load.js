/*
 *  PureJavacript, Load.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Load           = {}
Load.ImageFile = LoadInputFromImageFile
Load.Table     = LoadTableFromFile

function LoadInputFromImageFile( targetID, fileID, holderID )
{
	var target = document.getElementById( targetID );
	var file   = document.getElementById( fileID  );
	
	if ( target && file )
	{
		file.imageFile = new InputImageFile( fileID, null, function() { LoadInputFromImageFileHandler( targetID, fileID, holderID ); }, null );
	}
}

function LoadInputFromImageFileHandler( targetID, fileID, holderID )
{
	var target  = document.getElementById( targetID  );
	var file    = document.getElementById( fileID   );
	var holder  = document.getElementById( holderID );

	var base64 = Base64Encode( file.imageFile.reader.result );
	var ext    = file.imageFile.fileType;
	var url64  = "data:image/" + ext + ";base64," + base64;
	
	target.value = url64;

	if ( holder )
	{
		holder.style.background     = "white url(" + url64 + ") no-repeat center center";
		holder.style.backgroundSize = "cover";
	}
}

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
		var content   = Base64.Decode( LoadTableFromFile.file.reader.resultAsBase64 );
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

