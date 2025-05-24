FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5012

CMD [ "yarn", "dev" ]