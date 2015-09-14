
purejavascript    = purejavascript    || {}
purejavascript.io = purejavascript.io || {}

purejavascript.io.LineReader
=
function( file_content )
{
	this.lines = file_content.split("\n");
	this.line  = 0;
}

purejavascript.io.LineReader.prototype.readLine
=
function()
{
	var line = null;

	if ( this.line < this.lines.length )
	{
		line = this.lines[this.line++];
	}
	
	return line;
}
