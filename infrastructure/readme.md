# Infrastructure 🏗

## What is it?

Are Terraform manifests to provision in Google Cloud:

- Cloud Run
- Cloud Storage

in two environments:

- [dev](./dev)
- [prod](./prod)

## Install

1. Use the latest version of Terraform

   ```sh
   brew upgrade terraform
   ```

2. Go to an environment folder, e.g:

   ```sh
   cd dev
   ```

3. Create an `.env` file and set values from `.env.example`

   ```sh
   touch .env
   cat .env.example | >> .env
   ```

## Run

1. Source enviroment variables

   ```sh
   sources.env
   ```

2. Instantiate Terraform

   ```sh
   terraform init
   ```

3. See the provision plan

   ```sh
   terraform plan
   ```

4. Apply changes

   ```sh
   terraform apply
   ```

5. 🏗💥
