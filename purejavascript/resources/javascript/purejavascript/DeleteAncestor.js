
/*
 *	Delete the closest ancestor DOM node which is an instance of the given tag name and
 *	contains the target of the given event, which will be the target of the event if it is a tag of that type.
 */
function DeleteAncestor( event, tag )
{
    var target = event.target;

    while ( tag != target.tagName )
    {
        target = target.parentNode;
    }
    
    if ( target && target.parentNode )
    {
        target.parentNode.removeChild( target );
    }

    return false;
}
