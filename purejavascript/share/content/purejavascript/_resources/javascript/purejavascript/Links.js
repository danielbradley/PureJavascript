/*
 *  PureJavacript, Links.js
 *
 *  Copyright 2014 - 2017, CrossAdaptive
 */

Links          = {}
Links.Activate = LinksActivate
Links.Complete = LinksComplete

function LinksActivate( links, href )
{
	var n = links.length;
	
	for ( var i=0; i < n; i++ )
	{
		var link = links[i];

        if ( link.href == href )
        {
            link.className += ("" == link.className) ? "active" : " active";
        }

        if ( ((location.protocol + '//') != href) && (0 === href.indexOf(link.href)) )
        {
            var dashboard_url = location.protocol + '//' + location.hostname + '/dashboard/';

            if ( dashboard_url != link.href )
            {
                link.className += ("" == link.className) ? "subactive" : " subactive";
            }
        }
	}
}

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

