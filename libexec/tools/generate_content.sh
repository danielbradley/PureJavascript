#!/bin/bash

if [ $# -lt 3 ]
then

    echo "Usage: generate_content.sh <path> <type> <file> ..."
    exit

fi

path=$1
type=$2

shift
shift

echo "generate_content.sh \"${path}\" \"${type}\" \"$@\""

mkdir -p ${path}
echo  "<${type}>"             > ${path}/${type}.htm
max2html --content-only "$@" >> ${path}/${type}.htm
echo "</${type}>"            >> ${path}/${type}.htm

