FROM node:16

WORKDIR /usr/app

COPY package*.json ./api

RUN npm install

COPY . . 

EXPOSE 3000

CMD [ "npm", "start" ]