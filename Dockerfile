FROM node:22

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["npm", "run", "dev"]