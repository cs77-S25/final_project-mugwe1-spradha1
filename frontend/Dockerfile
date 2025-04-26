FROM node:lts-bullseye

WORKDIR /usr/src/app
COPY . .
EXPOSE 5173

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN chown -R node /usr/src/app
USER node
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]
