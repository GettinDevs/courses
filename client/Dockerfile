FROM node:alpine as BUILDER
WORKDIR /app

COPY package.json yarn.lock tsconfig.json .
RUN yarn install

COPY . .
RUN yarn build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILDER /app/build /usr/share/nginx/html
