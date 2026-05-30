FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "./wait-for-it.sh postgres:5432 -- node src/index.js"]
