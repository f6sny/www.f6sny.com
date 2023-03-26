FROM node:lts-alpine as builder

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN npm install

RUN npm run build

# expose 5000 on container
EXPOSE 5050

# start the app
CMD [ "npm", "start" ]
