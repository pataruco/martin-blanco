#!/bin/bash
set -euo pipefail

CLOUD_FUNCTION=martin-blanco-api
SOURCE=./api

gcloud functions deploy $CLOUD_FUNCTION --region=europe-west2 --source=$SOURCE --trigger-http --project $CLOUD_PROJECT --entry-point app --verbosity=info --runtime nodejs10
