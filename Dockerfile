# --------------> The build image
FROM node:20.8.0-alpine3.18 as build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
COPY --chown=node:node . .
RUN npm ci --only=production

# --------------> The production image
FROM node:20.8.0-alpine3.18
RUN apk add dumb-init
USER node
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["dumb-init", "node", "server.js"]
