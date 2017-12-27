<?php

function include_file( $filename )
{
    if ( file_exists( $filename ) )
    {
        include( $filename );
    }
    else
    {
        echo "/* Could not find file: $filename */";
    }
}

header( "Content-type:text/javascript" );

include_file( 'Base.js' );
include_file( 'AddClass.js' );
include_file( 'Auth.js' );
include_file( 'Base64.js' );
include_file( 'Call.js' );
include_file( 'Datalist.js' );
include_file( 'DataStorage.js' );
include_file( 'DecodeHTMLEntities.js' );
include_file( 'GetFormValues.js' );
include_file( 'GetSearchValues.js' );
include_file( 'HTMLEntitiesEncode.js' );
include_file( 'ImageCache.js' );
include_file( 'InputFile.js' );
include_file( 'InsertFormValues.js' );
include_file( 'InsertResponseValues.js' );
include_file( 'LoadInputFromImageFile.js' );
include_file( 'LoadTableFromFile.js' );
include_file( 'LocalStorage.js' );
include_file( 'RemoveClass.js' );
include_file( 'Replace.js' );
include_file( 'Save.js' );
include_file( 'Session.js' );
include_file( 'SetCookie.js' );
include_file( 'Setup.js' );
include_file( 'Selects.js' );
include_file( 'ShowHide.js' );
include_file( 'StringStripUnicode.js' );
include_file( 'StringTruncate.js' );
include_file( 'Submit.js' );
include_file( 'SubmitTableValues.js' );
include_file( 'Toggle.js' );
include_file( 'Up.js' );
include_file( 'Validate.js' );
include_file( 'WordLimit.js' );
include_file( 'csv/CSVFile.js' );
include_file( 'io/LineReader.js' );

