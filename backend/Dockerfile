FROM arm32v7/node as builder

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run test

FROM arm32v7/node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY . .

EXPOSE 3000  

CMD ["node", "app.js"]
