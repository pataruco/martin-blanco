#!/bin/bash
set -euo pipefail

# Create Open API HTML
yarn openapi-generator generate -i ./src/open-api/swagger.json -g html -o ./src/open-api
