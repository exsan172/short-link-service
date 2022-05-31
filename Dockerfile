FROM --platform=amd64 node:16.14.2
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . ./

ENV PORT=3000
ENV DB_HOST=mongodb://49.128.186.88:25731/
ENV SECRET_KEY=F@ky0u
ENV HOST_SMTP=smtp.mail.yahoo.com
ENV PORT_SMTP=465
ENV SECURE_SMTP=false
ENV USER_SMTP=short.in@yahoo.com
ENV PASS_SMTP=ixnanydnqkqylerl
ENV URL_REDIRECT=https://srtin.my.id

EXPOSE 3000
CMD ["npm", "start"]