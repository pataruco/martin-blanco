# Martin Blanco API 👨‍👩‍👧‍👦

![CI Prod](https://github.com/pataruco/martin-blanco/workflows/CI%20Prod/badge.svg)
![CI Dev](https://github.com/pataruco/martin-blanco/workflows/CI%20Dev/badge.svg)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## What is it?

Tools for my family API written in TypeScript.

This monorepo is divided in two main packages:

- [API](./api): is a Node/Express server container running on Google Cloud Run, you can find the schema [here](https://api.martin-blanco.com).
- [CLI](./upload-cli): is a tool to resize, rotate images and upload them to a Google Storage bucket.

Dependecies are managed by [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna),

Infrastructure is provioned by [Terraform](https://www.terraform.io/).

CI/CD using [GitHub Actions](https://help.github.com/en/actions) :octocat:.

## Installation

1. clone this repo

   ```sh
   git clone git@github.com:pataruco/martin-blanco.git
   ```

2. Get into the `martin-blanco` directory

   ```sh
   cd martin-blanco
   ```

3. Install dependencies

   ```sh
   yarn
   ```
