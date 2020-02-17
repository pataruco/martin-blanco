#!/bin/bash
set -euo pipefail

# Copy package json
cp ./package.json ./dist

# Compile TS -> JS
yarn tsc --build
