#!/bin/bash
set -euo pipefail

# Create Open API HTML
yarn redoc-cli bundle ./src/open-api/open-api-schema.json --options.theme.colors.primary.main=black

# Move file to open-api folder
mv ./redoc-static.html ./src/open-api/index.html
