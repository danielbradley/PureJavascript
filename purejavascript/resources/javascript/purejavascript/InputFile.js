
function InputFile( file_id, progress_handler, onload_handler, onerror_handler )
{
	return new InputFile.Class( file_id, progress_handler, onload_handler, onerror_handler );
}

InputFile.Class
=
function ( file_id, progress_handler, onload_handler, onerror_handler )
{
	this.reader            = new FileReader();
	this.reader.onprogress = progress_handler ? progress_handler : InputFile.OnProgress;
	this.reader.onload     =   onload_handler ?   onload_handler : InputFile.OnLoad;
	this.reader.onerror    =  onerror_handler ?  onerror_handler : InputFile.OnError;
	this.count             = 0;

	var input = document.getElementById( file_id );
	var file  = input.files[0];

	this.reader.readAsText( file );
}

InputFile.Class.prototype.getCount
=
function()
{
	return this.count;
}

InputFile.OnProgress
=
function()
{
	console.log( "InputFile: default onprogress handler" );
}

InputFile.OnLoad
=
function()
{
	console.log( "InputFile: default onload handler" );
}

InputFile.OnError
=
function()
{
	console.log( "InputFile: default onerror handler" );
}
