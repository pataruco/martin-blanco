# API 📡

## What is it?

Is an API to serve pictures of my family.

As part of my roadmap is to extend this to:

- Serve movies
- Do my main groceries using my supermarket API

Open API Schema Valid
![](http://validator.swagger.io/validator?url=https://raw.githubusercontent.com/pataruco/martin-blanco/master/api/src/open-api/open-api-schema.json)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8f4d16a4b130529776a8)

## Installation

1. Get into the `api` directory

   ```sh
   cd api
   ```

2. Install dependencies

   ```sh
   yarn
   ```

3. Create a [Google Cloud service account key](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) for dev enviroment

   ```sh
   gcloud iam service-accounts keys create [FILE_NAME].json --iam-account [NAME]@[martin-blanco-api-dev.iam.gserviceaccount.com
   ```

4. Create an `.env` file and set values from `.env.example`

   ```sh
   touch .env
   cat .env.example | >> .env
   ```

## Run

### Local

To spin a local server type

```sh
yarn dev
```

## Build

### Local

To build and deploy into Cloud Run dev environment type:

```sh
sh ./scripts/cloud-run-build-deploy.sh
```

or commit your changes in a branch and push to remote branch and GitHub Actions will deploy it :octocat: :rocket:

You can see your change on dev environment here: [https://dev.martin-blanco.com](https://dev.martin-blanco.com)

## Tests

TODO 🧪🏗
