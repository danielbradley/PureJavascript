
function LoadInputFromImageFile( inputID, fileID, holderID )
{
	var input = document.getElementById( inputID );
	var file  = document.getElementById( fileID  );
	
	if ( input && file )
	{
		file.imageFile = new InputImageFile( fileID, null, function() { LoadInputFromImageFileHandler( inputID, fileID, holderID ); }, null );
	}
}

function LoadInputFromImageFileHandler( inputID, fileID, holderID )
{
	var input  = document.getElementById( inputID  );
	var file   = document.getElementById( fileID   );
	var holder = document.getElementById( holderID );

	var base64 = Base64Encode( file.imageFile.reader.result );
	var ext    = file.imageFile.fileType;
	var url64  = "data:image/" + ext + ";base64," + base64;
	
	input.value = url64;

	if ( holder )
	{
		holder.style.background     = "white url(" + url64 + ") no-repeat center center";
		holder.style.backgroundSize = "cover";
	}
}
