FROM node:20-alpine
LABEL org.opencontainers.image.source=https://github.com/mdahamshi/top-members

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "node src/index.js"]
