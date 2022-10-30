FROM node:16-alpine AS development
WORKDIR /app/
COPY package.json yarn.lock /app/
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn" , "start"]
