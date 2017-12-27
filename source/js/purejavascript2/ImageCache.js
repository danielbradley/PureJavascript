
/*
 *	ImageCache caches images within local storage to reduce the need to access an image server.
 *
 *	Images are identified by an imageID, and are stored within localStorage using the ID:
 *	"pj-imagecache-<imageID>.
 *
 *	If an image has not been cached the passed RetrieveImage function is called with the imageID passed
 *	as a parameter.
 */


function ImageCache( imageID, RetrieveImage, SetImage )
{
	var image = null;
	var fq_id = "pj-imagecache-" + imageID;
	
	if ( LocalStorage.Exists() )
	{
		if ( LocalStorage.HasItem( fq_id ) )
		{
			SetImage( LocalStorage.GetItem( fq_id ) );
		}
		else
		{
			RetrieveImage( imageID, function( url_image )
				{
					if ( url_image && ("" != url_image ) )
					{
						LocalStorage.SetItem( fq_id, url_image ); SetImage( url_image );
					}
				}
			);
		}
	}
	else
	{
		RetrieveImage( imageID, SetImage );
	}

	return image;
}
