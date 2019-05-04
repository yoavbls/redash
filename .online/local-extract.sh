#!/bin/bash
# ------ Needs to be run from redash.txt folder context! ------
[ "$UID" -eq 0 ] || exec sudo bash "$0" "$@" # Eleveta to root


decode_txt_file() {
    echo "Decoding text file..."
    base64 -d < redash.txt > redash.txt.tar.gz
    apt install pv > /dev/null
    if hash pv ; then ext_cmd=pv ; else ext_cmd=cat ; fi
}

extract_tar_files() {
    echo "Extract tar.gz file..." && $ext_cmd redash.txt.tar.gz | tar xzf - -C .
    echo "Extracting Artifact..." && $ext_cmd redash/.online/artifact.tar | tar xkf - -C ./redash
}

load_images() {
    for img in $(find redash/.tmp/images/*); do
        $DOCKER load -i $img ;
    done
}

decode_txt_file
extract_tar_files
load_images