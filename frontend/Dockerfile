FROM node:lts-bullseye

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
RUN npm prune --production

EXPOSE 5173
CMD ["npm", "start"]
