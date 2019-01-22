#!/bin/bash
set -eu
cd "$(git rev-parse --show-toplevel)"    # CD to main directory 
DOCKER=docker.exe                        # Set docker binary (docker.exe working in wsl)
DOCKER_COMPOSE=docker-compose.exe        # Set docker binary (docker-compose.exe working in wsl)


build_client() {
    npm install
    NODE_ENV=production npx webpack
}

download_pip_modules() {
    mkdir -p .tmp/pip
    pip download -d .tmp/pip -r requirements.txt -r requirements_dev.txt -r requirements_all_ds.txt
}

tar_artifacts() {
    tar -cvf .offline/artifact.tar node_modules client/dist .tmp/pip 
}

build_base_image() {
    $DOCKER build --compress --squash . -f .offline/DockerfileBase -t redash/base:latest
} 

build_offline_image() {
    $DOCKER build --compress --squash . -f .offline/Dockerfile -t redash/redash:latest -t redash/offline:latest
}

initial_instance() {
    # docker-compose not working with context that is not the root folder
    cp .offline/docker-compose.yml docker-compose.offline.yml
    $DOCKER_COMPOSE -f docker-compose.offline.yml up -d
    sleep 10 # Take initial delay before creating the DB
    $DOCKER_COMPOSE -f docker-compose.offline.yml run server create_db
    rm docker-compose.offline.yml
}

save_production_images() {
    # Collect Image names
    images=('redash/base:latest')
    for img in $(cat .offline/docker-compose.yml | awk '{if ($1 == "image:") print $2;}'); do
        images+=($img)
    done

    # Save images
    echo Images: ${images[*]}
    mkdir -p .tmp/images
    for img in ${images[*]}; do
        echo Save: $img
        docker save $img -o ".tmp/images/${img//[:\/]/-}.tar"
    done
}

bundle_folder() {
    git bundle create .git/bundle --all
    tar cvfz ../redash.tar.gz --exclude node_modules --exclude client/dist --exclude .tmp/pip  ../redash
    base64 < ../redash.tar.gz > ../redash.txt
    cp .offline/offline-extract.sh ../offline-extract.sh
    echo -e "\033[32m The packaging was successful! \033[0m"
    echo -e "You can move \033[0;34mredash.txt\033[0m and \033[0;34moffline-extract.sh\033[0m to your offline environment."
}


#build_client
#download_pip_modules
#sleep 1
#tar_artifacts
#sleep 1
# build_base_image
# build_offline_image
initial_instance
save_production_images
bundle_folder