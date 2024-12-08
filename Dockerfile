FROM node:18-alpine

WORKDIR /app
COPY package* .
RUN npm i

COPY . .



# RUN DOCKER
# docker-compose build
# docker-compose up -d