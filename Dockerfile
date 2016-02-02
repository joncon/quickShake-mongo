FROM node:5.5
RUN apt-get update -qq && apt-get install -y build-essential
RUN mkdir /quickShake-mongo
WORKDIR /quickShake-mongo
ADD package.json /quickShake-mongo/package.json
RUN npm install

