#!/bin/bash
set -euo pipefail

# Copy .npmrc
echo registry=https://npm.pkg.github.com/@pataruco >>./dist/.npmrc
echo //npm.pkg.github.com/:_authToken=${GITHUB_REGISTRY_AUTH_TOKEN} >>./dist/.npmrc

# Copy package json
cp ./package.json ./dist

# Compile TS -> JS
yarn tsc --build ./tsconfig.json
