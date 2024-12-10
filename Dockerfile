FROM node:20-alpine

WORKDIR /app

COPY .output/ ./

EXPOSE 3001

ENV NITRO_PORT=3001

CMD ["node", "server/index.mjs"]