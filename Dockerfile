FROM --platform=amd64 node:16.14.2
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . ./

ENV PORT=3000
ENV DB_HOST=mongodb://exsan:r3n41dhi@ac-bzajofk-shard-00-00.ixqaznd.mongodb.net:27017,ac-bzajofk-shard-00-01.ixqaznd.mongodb.net:27017,ac-bzajofk-shard-00-02.ixqaznd.mongodb.net:27017/?ssl=true&replicaSet=atlas-85oxjh-shard-0&authSource=admin&retryWrites=true&w=majority
ENV SECRET_KEY=F@ky0u
ENV HOST_SMTP=smtp.mail.yahoo.com
ENV PORT_SMTP=465
ENV SECURE_SMTP=false
ENV USER_SMTP=short.in@yahoo.com
ENV PASS_SMTP=ixnanydnqkqylerl
ENV URL_REDIRECT=https://srtin.my.id

EXPOSE 3000
CMD ["npm", "start"]
