#!/bin/bash
set -euo pipefail

CLOUD_FUNCTION=martin-blanco-api
SOURCE=.
CLOUD_PROJECT=martin-blanco-api-prod

gcloud functions deploy $CLOUD_FUNCTION --region=europe-west2 --source=$SOURCE --trigger-http --project $CLOUD_PROJECT --entry-point app --verbosity=info --runtime nodejs10 --set-env-vars BUCKET_NAME="${BUCKET_NAME}"
