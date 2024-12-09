FROM node:20-alpine

WORKDIR /app

COPY . .

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["npm", "run", "dev"]