#!/bin/bash
set -euo pipefail
cd src
zip ../example.zip main.js
cd ..
aws s3 cp example.zip s3://peter-of-the-day-staging/v1.0.0/example.zip