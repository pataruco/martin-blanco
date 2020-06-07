FROM node:12.18-alpine

RUN apk add --no-cache bash

# Create and change to the app directory.
WORKDIR /opt/app

COPY package.json .

COPY tsconfig-cloud-run.json .

COPY src ./src

RUN yarn --frozen-lockfile --silent --production=false

RUN yarn tsc --build ./tsconfig-cloud-run.json 

CMD ["yarn", "start"]


