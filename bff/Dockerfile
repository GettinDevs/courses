FROM node:alpine as BUILDER
WORKDIR /app

COPY package.json yarn.lock tsconfig.json .
RUN yarn install

COPY ./src ./src
RUN yarn build

EXPOSE 8000
CMD ["yarn", "start"]
