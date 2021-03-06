/*
 *  PureJavacript, InputFile.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

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
	this.reader.onloadend  =  onload_handler ?   onload_handler : InputFile.OnLoad;
	this.reader.onerror    =  onerror_handler ?  onerror_handler : InputFile.OnError;
	this.count             = 0;

	var input = document.getElementById( file_id );
	var file  = input.files[0];

	switch ( input.files[0].type.split( "/" )[1] )
	{
	case "png":
		this.fileType = "png";
		break;
		
	case "jpg":
	case "jpeg":
		this.fileType = "jpg";
		break;

	default:
		this.fileType = "";
	}

    /*
     *  Kludge to allow IE browsers to call 'readAsBinaryString', see:
     *  https://stackoverflow.com/questions/31391207/javascript-readasbinarystring-function-on-e11
     */

    if ( FileReader.prototype.readAsBase64 === undefined )
    {
        FileReader.prototype.readAsBase64
        =
        function( file_input )
        {
            this.readAsArrayBuffer( file_input );
        }

        this.reader.onload
        =
        function( e )
        {
            var binary = "";
            var bytes  = new Uint8Array( this.result );
            var length = bytes.byteLength;

            for ( var i=0; i < length; i++ )
            {
                binary += String.fromCharCode( bytes[i] )
            }

            this.resultAsBase64 = Base64.Encode( binary );
        }
    }

    this.reader.readAsBase64( file );
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

