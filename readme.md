# Martin Blanco API 👨‍👩‍👧‍👦

![CI Prod](https://github.com/pataruco/martin-blanco/workflows/CI%20Prod/badge.svg)
![CI Dev](https://github.com/pataruco/martin-blanco/workflows/CI%20Dev/badge.svg)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## What is it?

Tools for my family API written on TypeScript.

Dependecies are managed by [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Lerna](https://github.com/lerna/lerna)

Infrastructure is provioned by [Terraform](https://www.terraform.io/), [here](./infrastructure) is the code.

This monorepo is divided in two main packages:

- [API](./api/readme.md): is a Node/Express server container running on Google Cloud Run, you can find the schema [here](https://api.martin-blanco.com)
- [CLI](./upload-cli/readme.md): is a tool to resize, rotate images and upload them to a Google Storage bucket

## Installation

1. git clone this repo

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
