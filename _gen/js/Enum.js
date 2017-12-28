/*
 *  PureJavacript, Enum.js
 *
 *  Copyright 2017, CrossAdaptive
 */

function Enum( values )
{
    var e = {}
    var n = values.length;

    for ( var i=0; i < n; i++ )
    {
        var name = values[i]

        e[name] = name;
    }

    return e;
}

