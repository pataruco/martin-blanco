#!/bin/bash
set -euo pipefail

# Docker build
docker build . --tag gcr.io/${PROJECT}/${SERVICE_NAME}

# Docker Push
docker push gcr.io/${PROJECT}/${SERVICE_NAME}

#Digest
export DIGEST=$(docker image ls --digests gcr.io/${PROJECT}/${SERVICE_NAME} --format "{{.Digest}}")

# GCloud run deploy
gcloud run deploy ${SERVICE_NAME} --set-env-vars BUCKET_NAME=${BUCKET_NAME} --image gcr.io/${PROJECT}/${SERVICE_NAME}
