
function CSVFile( file_content )
{
	this.headers = new Array();
	this.rows    = new Array();

	this.parseContent( file_content );
}

CSVFile.prototype.getValueFor
=
function( row, labels )
{
	var value = "";
	var n     = labels.length;

	for ( var i=0; i < n; i++ )
	{
		var value = this.getValue( row, labels[i] );
		
		if ( "" != value ) break;
	}

	return value;
}

CSVFile.prototype.getValue
=
function( row, label )
{
	var value  = "";
	var column = -1;
	var n      = this.headers.length;
	
	for ( var i=0; i < n; i++ )
	{
		var text1 = label.toLowerCase().trim();
		var text2 = this.headers[i].toLowerCase().trim();
	
		if ( text1 == text2 )
		{
			column = i; break;
		}
	}

	if ( -1 != column )
	{
		var array = this.rows[row];
			value = array[column];
	}
	
	return value;
}

CSVFile.prototype.getNrOfRows
=
function()
{
	return this.rows.length;
}

CSVFile.prototype.CSVLineRE = new RegExp('("[\\w ,]+" ?|[\\w ]*), ?("[\\w ,]+" ?|[\\w ]*)$');

CSVFile.prototype.parseContent
=
function( file_content )
{
	var line_reader = new purejavascript.io.LineReader( file_content );
	var line  = line_reader.readLine();
	if ( line )
	{
        var trimmed = line.trim(); //trims CRs from Mac apps such as Numbers.
        //if (!this.CSVLineRE.test(trimmed)) throw "Header of file does not match expected Excel/LibreOffice CSV format."
		this.headers = this.SplitAndTrim( trimmed );

		while ( (line = line_reader.readLine()) )
		{
			this.rows.push( this.SplitAndTrim( line ) );
		}
	}
}

CSVFile.prototype.SplitAndTrim
=
function( line )
{
	var array = new Array();
	var bits  = this.SplitWhileRespectingQuotes( line, "," );
	var n     = bits.length;
	
	for ( var i=0; i < n; i++ )
	{
		var field = bits[i];
			field = field.trim();
		var x     = field.length - 1;

		if ( '"' == field.charAt( x ) ) field = field.substring( 0, x );
		if ( '"' == field.charAt( 0 ) ) field = field.substring( 1    );

		field = field.trim();
	
		array.push( field );
	}
	return array;
}

CSVFile.prototype.SplitWhileRespectingQuotes
=
function( line, delimiter )
{
	var array = Array();
	var out   = true;
	var s     = 0;
	var n     = line.length;
	
	for ( var i=0; i < n; i++ )
	{
		switch ( line.charAt( i ) )
		{
		case '"':
			out = !out;
			break;
			
		case delimiter:
			if ( out )
			{
				array.push( line.substring( s, i ) );
				s = i + 1;
			}
			break;
		}
	}
	
	if ( s < n )
	{
		array.push( line.substring( s, n ) );
	}
	
	return array;
}



