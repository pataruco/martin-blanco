#!/bin/bash
set -euo pipefail
cd src
zip ../dates.zip dates.js
zip ../date.zip dates.js 
cd ..
aws s3 cp example.zip s3://peter-of-the-day-staging/v1.0.0/dates.zip
aws s3 cp example.zip s3://peter-of-the-day-staging/v1.0.0/date.zip