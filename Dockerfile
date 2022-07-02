FROM node:18-alpine

WORKDIR /app

RUN apk update
RUN apk add git

RUN npm install -g @google/clasp
