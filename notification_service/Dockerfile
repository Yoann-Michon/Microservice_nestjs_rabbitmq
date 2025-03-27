FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY backup_mariadb.sh /usr/local/bin/backup_mariadb.sh

RUN chmod +x /usr/local/bin/backup_mariadb.sh

RUN apk add --no-cache cronie

RUN echo "0 2 * * * /usr/local/bin/backup_mariadb.sh" >> /etc/crontab

RUN npm run build

EXPOSE 4006

CMD ["sh", "-c", "crond && npm run start"]
