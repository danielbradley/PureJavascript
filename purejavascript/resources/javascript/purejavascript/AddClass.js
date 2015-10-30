
function AddClass( e, className )
{
	if ( ! AddClass.Contains( e, className ) )
	{
		if ( "" == e.className )
		{
			e.className = className;
		}
		else
		{
			e.className += " " + className;
		}
	}
}

AddClass.Contains
=
function( e, className )
{
	//
	//	AddClass.Contains( { className="cls active" }, "active' );
	//
	//	var st = 10 - 6;
	//
	//	0123456789
	//	cls active
	//	01234

	var contains = false;
	var st = (e.className.length - className.length) - 1;

	if ( className == e.className )
	{
		contains = true;
	}
	else
	if ( 0 <= st )
	{
		if ( -1 != e.className.indexOf( " " + className + " " ) )
		{
			contains = true;
		}
		else
		if ( 0 == e.className.indexOf( className + " " ) )
		{
			contains = true;
		}
		else
		if ( st == e.className.indexOf( " " + className ) )
		{
			contains = true;
		}
	}
	return contains;
}


StyleClasses = {
    //Append class if not already in classes list.
    AddClass: AddClass,  //body remains outside StyleClasses for backwards compatibility.
    
    // Check if class is in element's classes.
    ContainsClass:AddClass.Contains,
    
    //Remove a classname from an element's list of active styling classes.
    RemoveClass: function(e, className) {
        if ( className == e.className )
        {
            e.className='';
            return true;
        }
        var maxStart = (e.className.length - className.length) - 1;
        if ( 0 <= maxStart )
        {
            var start;
            
            start = e.className.indexOf( " " + className + " ");
            if ( -1 != start )
            {
                e.className = e.className.substring(0,start) + e.className.substring(start+1+className.length);
                return true;
            }
            
            start = e.className.indexOf( className + " " );
            if ( 0 == start)
            {
                e.className = e.className.substring(1+className.length);
                return true;
            }
            
            start = e.className.indexOf( " " + className );
            if ( maxStart == start  )
            {
                e.className = e.className.substring(0, start);
                return true;
            }
        }
        return false;
    }
};

