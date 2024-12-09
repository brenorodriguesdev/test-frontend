FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia todos os arquivos do projeto (exceto os listados no .dockerignore)
COPY . .

EXPOSE 3001

# Define a variável de ambiente para o Nuxt ouvir em qualquer IP
ENV HOST=0.0.0.0
ENV PORT=3001

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]