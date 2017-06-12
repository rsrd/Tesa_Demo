#!/bin/bash

if [ "$#" -ne 5 ]; then
    echo "Invalid parameters. Please provide correct parameters"
    echo ""
    echo "Example: ./data-model-diff.sh \"source path for sampledata\" \"Branch name\" \"folder name\" \"from checksum\" \"to checksum\" "
    exit
fi

sourcedir=$1
branch=$2
folder=$3
start_checksum=$4
end_checksum=$5
patch_folder=$sourcedir/$folder-patch

rm -rf $patch_folder
cd $sourcedir
mkdir -p $patch_folder

git checkout $branch
git pull

#Create folder structure in patch folder
for f in $sourcedir/$folder/*;
do
    mkdir -p $patch_folder/$(basename $f)
done

git diff --name-only --raw $start_checksum $end_checksum > diff.txt

while read -r line
do
    if [[ "$line" == "$folder"* ]]; then
        echo "$line"
        op_file=$line
        op_file=$(sed "s|$folder|$folder-patch|g" <<< "$op_file")

        mkdir -p "$sourcedir/${op_file%/*}"
        cp "$sourcedir/$line" "$sourcedir/$op_file"
    fi

done < diff.txt

rm -rf diff.tx
