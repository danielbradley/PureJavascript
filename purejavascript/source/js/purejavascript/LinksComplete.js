
function LinksComplete( links, tuple )
{
	var n = links.length;
	
	for ( var i=0; i < n; i++ )
	{
		var link = links[i];
		
		link.href      = Replace( link.href,      tuple );
		link.innerHTML = Replace( link.innerHTML, tuple );
	}
}
