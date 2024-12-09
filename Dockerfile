FROM node:20-alpine

WORKDIR /app

COPY .output/ ./

RUN npm install --production

EXPOSE 3001

ENV NITRO_PORT=3001

CMD ["node", "server/index.mjs"]