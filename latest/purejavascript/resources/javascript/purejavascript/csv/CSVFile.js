
purejavascript     = purejavascript     || {}
purejavascript.csv = purejavascript.csv || {}

purejavascript.csv.CSVFile
=
function( file_content )
{
	this.headers = new Array();
	this.rows    = new Array();

	this.parseContent( file_content );
}

purejavascript.csv.CSVFile.prototype.getValue
=
function( row, label )
{
	var value  = "";
	var column = -1;
	var n      = this.headers.length;
	
	for ( var i=0; i < n; i++ )
	{
		if ( label == this.headers[i] )
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

purejavascript.csv.CSVFile.prototype.getNrOfRows
=
function()
{
	return this.rows.length;
}

purejavascript.csv.CSVFile.prototype.parseContent
=
function( file_content )
{
	var line_reader = new purejavascript.io.LineReader( file_content );
	var line  = line_reader.readLine();
	if ( line )
	{
		this.headers = this.SplitAndTrim( line );

		while ( (line = line_reader.readLine()) )
		{
			this.rows.push( this.SplitAndTrim( line ) );
		}
	}
}

purejavascript.csv.CSVFile.prototype.SplitAndTrim
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
	
		array.push( field );
	}
	return array;
}

purejavascript.csv.CSVFile.prototype.SplitWhileRespectingQuotes
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



