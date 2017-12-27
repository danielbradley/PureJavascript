
purejavascript.loadmore = {}

purejavascript.setup.loadmore
=
function()
{
	var elements = document.getElementsByTagName( "a" );
	var n        = elements.length;
	
	for ( var i=0; i < n; i++ )
	{
		var anchor = elements[i];
		
		if ( "loadmore" == anchor.getAttribute( "data-action" ) )
		{
			anchor.addEventListener( "click", purejavascript.loadmore.onClick, false );
		}
	}
}

purejavascript.loadmore.onClick
=
function( event )
{
	var target   = this.getAttribute( "data-target"   );
	var display  = this.getAttribute( "data-display"  );
	var mod      = this.getAttribute( "data-mod"      );
	var retrieve = this.getAttribute( "data-retrieve" );

	var  t = document.getElementById( target );
	if ( t )
	{
		var command  = "action="    + "articles";
			command += "&display="  + display;
			command += "&mod="      + mod;
			command += "&retrieve=" + retrieve;
	
		var htm = purejavascript.syncCall( command );
		
		t.innerHTML = htm;

		purejavascript.setup.loadmore();
	}
	return false;
}
