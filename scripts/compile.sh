#!/bin/bash
set -euo pipefail

# Copy package json
cp ./package.json ./dist

# Create open-api folder
mkdir ./dist/open-api

# Copy package json
cp ./src/open-api/*.* ./dist/open-api

# Compile TS -> JS
yarn tsc --build
