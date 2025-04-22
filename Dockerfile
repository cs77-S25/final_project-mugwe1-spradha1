FROM node:lts-bullseye
ENV NODE_ENV=production
# ARG DATABASE_URL
# ENV DATABASE_URL=postgresql://postgres:example@ascribe-db:5432/ascribe_db

RUN apt-get update
RUN apt-get install -y vim netcat-openbsd

WORKDIR /usr/src/app
COPY . .
EXPOSE 3000

RUN chown -R node /usr/src/app
USER node
RUN npm install
# RUN npx prisma generate
# RUN DATABASE_URL=$DATABASE_URL npm run build
RUN npm run build
CMD ["npm", "start"]