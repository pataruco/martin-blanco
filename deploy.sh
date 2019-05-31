#!/bin/bash
set -euo pipefail
cd src
zip ../martin-blanco-api.zip dates.js dates.js 
cd ..
aws s3 cp martin-blanco-api.zip s3://peter-of-the-day-staging/v1.0.0/martin-blanco-api.zip
