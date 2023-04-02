FROM node:lts-alpine as builder

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN npm install

RUN npm run build
ARG API_AUTH_URL
ENV API_AUTH_URL ${API_AUTH_URL}
ARG NUXT_HOST
ENV NUXT_HOST ${NUXT_HOST}
ARG NUXT_PORT
ENV NUXT_PORT ${NUXT_PORT}
ARG API_URL
ENV API_URL ${API_URL}

# expose 5050 on container
EXPOSE 5050

# start the app
CMD [ "npm", "start" ]
