# Upload CLI

## What is it?

Is a command line tool to:

- rotate (if it is need) images.
- resize images.
- upload images to Google Cloud Storage

for them to be serve using the [API](../api)

## Installation

1. Install **ffmpeg**

   ```sh
   brew install ffmpeg
   ```

2. Get into the `upload-cli` directory

   ```sh
   cd upload-cli
   ```

3. Install dependencies

   ```sh
   yarn
   ```

4. Create an `.env` file and set values from `.env.example`

   ```sh
   touch .env
   cat .env.example | >> .env
   ```

# Run

To upload files type

```sh
yarn upload
```

Follow the instructions on prompt:

1. Type source directory as an absolute path, e.g.: `Users/<username>/Desktop/upload`

2. Target an environment:

   - Development
   - Production

3. ☕️
4. 🍾💥🎉

## Tests

TODO 🧪🏗
