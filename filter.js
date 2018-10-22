Filter.TableBody
=
function( tbody_id, form )
{
    // 1)   Retrieve values frorm any selects/inputs in forms.

    var values = Filter.TableBody.RequiredValues( form ); // Returns text array.

    //  2)  Iterate through tables rows and show/hide matching/unmatching rows.

    var tbody  = document.getElementById( tbody_id );
    var rows   = tbody.getElementsByTagName( "TR" );
    var n      = rows.length;

    for ( var i=0; i < n; i++ )
    {
        var tr = rows[i];
            tr.style.display = Filter.TableBody.ContainsAll( tr, values ) ? "table-row" : "none";
    }
}

Filter.TableBody.RequiredValues
=
function( form )
{
    var values = new Array();
    var n      = form.elements.length;

    for ( var i = 0; i < n; i++ )
    {
        var input = form.elements[i];

        switch ( input.tagName )
        {
        case "SELECT":
            var option = input.options[input.selectedIndex];
            var text   = option.text.toLowerCase();

            if ( option.value && ("" != text) )
            {
                values.push( text );
            }
            break;

        case "INPUT":
            if ( "" != input.value )
            {
                var bits = input.value.split( " " );
                for ( index in bits )
                {
                    values.push( bits[index].toLowerCase() );
                }
            }
            break;
        }
    }

    return values;
}

Filter.TableBody.ContainsAll
=
function( tr, values )
{
    //  Returns true only if tr contains all values in passed array.

    var contains = true;
    var n        = values.length;

    for ( var i=0; i < n; i++ )
    {
        if (-1 === tr.innerHTML.toLowerCase().indexOf( values[i] ))
        {
            contains = false;
            break;
        }
    }

    return contains;
}

Filter.TableBody
=
function( tbody_id, form )
{
    // 1)   Retrieve values frorm any selects/inputs in forms.

    var values = Filter.TableBody.RequiredValues( form ); // Returns text array.

    //  2)  Iterate through tables rows and show/hide matching/unmatching rows.

    var tbody  = document.getElementById( tbody_id );
    var rows   = tbody.getElementsByTagName( "TR" );
    var n      = rows.length;

    for ( var i=0; i < n; i++ )
    {
        var tr = rows[i];
            tr.style.display = Filter.TableBody.ContainsAll( tr, values ) ? "table-row" : "none";
    }
}

Filter.TableBody.RequiredValues
=
function( form )
{
    var values = new Array();
    var n      = form.elements.length;

    for ( var i = 0; i < n; i++ )
    {
        var input = form.elements[i];

        switch ( input.tagName )
        {
        case "SELECT":
            var option = input.options[input.selectedIndex];
            var text   = option.text.toLowerCase();

            if ( option.value && ("" != text) )
            {
                values.push( text );
            }
            break;

        case "INPUT":
            if ( "" != input.value )
            {
                var bits = input.value.split( " " );
                for ( index in bits )
                {
                    values.push( bits[index].toLowerCase() );
                }
            }
            break;
        }
    }

    return values;
}

Filter.TableBody.ContainsAll
=
function( tr, values )
{
    //  Returns true only if tr contains all values in passed array.

    var contains = true;
    var n        = values.length;

    for ( var i=0; i < n; i++ )
    {
        if (-1 === tr.innerHTML.toLowerCase().indexOf( values[i] ))
        {
            contains = false;
            break;
        }
    }

    return contains;
}

