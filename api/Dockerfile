FROM node:12.6-alpine

RUN apk add --no-cache bash

# Create and change to the app directory.
WORKDIR /opt/app

COPY package.json .

COPY tsconfig.json .

COPY src ./src

RUN ls -la

RUN yarn --frozen-lockfile --silent --production=false

RUN ls -lah

RUN pwd

RUN yarn tsc .

CMD ["yarn", "start"]


