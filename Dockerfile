FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json yarn.lock  ./

RUN yarn install
COPY . .
COPY --chown=node:node . .
RUN yarn run build


FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package.json /home/node/yarn.lock ./
COPY --from=builder --chown=node:node /home/node/jwtRS256.key.pub /home/node/jwtRS256.key ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
CMD ["ts-node" , "./node_modules/typeorm/cli.js migration:run InitialMigration"]
EXPOSE 3000
CMD ["node", "dist/main.js"]
