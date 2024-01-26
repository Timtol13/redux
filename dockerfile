FROM node:16-alphine

WORKDIR /redux

COPY package.json ./

EXPOSE 3000

COPY . .
