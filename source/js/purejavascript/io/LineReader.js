
function LineReader( file_content, limit )
{
	this.content = file_content;
	this.pos     = 0;
	this.lines   = 0;
	this.limit   = limit;
}

LineReader.prototype.readLine
=
function()
{
	var line = false;
	var loop = true;

	if ( ++this.lines < this.limit )
	{
		if ( this.pos < this.content.length )
		{
			line = "";
		
			while ( this.pos < this.content.length )
			{
				var ch = this.content[this.pos++];
				
				if ( '\n' == ch )
				{
					break;
				}
				else
				{
					line += ch;
				}
			}
		}
	}

	return line;
}
