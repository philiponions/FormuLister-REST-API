FROM node:16

COPY package*.json ./

COPY . .

EXPOSE 8080

RUN npm install
RUN npm ci --omit=dev

CMD ["node", "index.js"]