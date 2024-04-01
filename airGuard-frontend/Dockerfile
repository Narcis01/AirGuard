FROM arm32v7/node as builder

WORKDIR /usr/src/app

RUN apt-get update -qy
RUN apt-get install -y firefox-esr
ENV CHROME_BIN /usr/bin/firefox-esr

COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install

COPY . .

RUN npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessNoSandbox


RUN ng build --configuration=production

FROM arm32v7/nginx:1.22-alpine-perl


COPY --from=builder /usr/src/app/dist/* /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
