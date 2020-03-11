#!/bin/bash
set -euo pipefail

# Set current working directory to the directory of the script
cd "$(dirname "$0")"

echo "Login into GitHub NPM registry 💻"
yarn login --registry=https://npm.pkg.github.com/ --scope=@pataruco
echo "Publishing shared package to GitHub registry 🚀"
yarn publish
