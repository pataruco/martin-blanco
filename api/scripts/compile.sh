#!/bin/bash
set -euo pipefail

# Copy .npmrc
cp ./.npmrc ./dist

# Copy package json
cp ./package.json ./dist

# Compile TS -> JS
yarn tsc --build ./tsconfig.json
