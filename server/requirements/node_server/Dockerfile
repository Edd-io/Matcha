FROM debian:latest

RUN apt update
RUN apt upgrade -y
RUN apt install curl -y



ENV NODE_VERSION=22.12.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

COPY server /app

ARG MYSQL_ROOT_PASSWORD=;
ARG MYSQL_DATABASE=;
ARG MYSQL_USER=;
ARG MYSQL_PASSWORD=;
ARG MAIL_ID=;
ARG MAIL_PASS=;
ARG MAIL_FROM=;
ARG HOST=;
ARG PORT=;
ARG UID_42=;
ARG SECRET_42=;
ARG URL_42_AUTH=;
ARG URL_LOGIN_42=;
ARG URL_LINK_42=;
ARG URL_42_LINK=;

ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV MAIL_ID=${MAIL_ID}
ENV MAIL_PASS=${MAIL_PASS}
ENV MAIL_FROM=${MAIL_FROM}
ENV HOST=${HOST}
ENV PORT=${PORT}
ENV UID_42=${UID_42}
ENV SECRET_42=${SECRET_42}
ENV URL_42_AUTH=${URL_42_AUTH}
ENV URL_LOGIN_42=${URL_LOGIN_42}
ENV URL_LINK_42=${URL_LINK_42}
ENV URL_42_LINK=${URL_42_LINK}

RUN echo '{"host": "localhost", "user": "'$MYSQL_USER'", "password": "'$MYSQL_PASSWORD'", "database": "'$MYSQL_DATABASE'", "mail_id": "'$MAIL_ID'", "mail_pass": "'$MAIL_PASS'", "mail_from": "'$MAIL_FROM'", "mail_host": "'$HOST'", "port": "'$PORT'", "uid_42": "'$UID_42'", "secret_42": "'$SECRET_42'", "url_42_auth": "'$URL_42_AUTH'", "url_42_link": "'$URL_42_LINK'"}' > /app/credentials.json

WORKDIR /app

RUN mkdir -p /app/user_static_data/
RUN mkdir -p /app/website/

# line for local testing
COPY ./img_test /app/user_static_data/

COPY ../App/dist /app/website

RUN echo "var url_login_42 = \"$URL_LOGIN_42\"; var url_link_42 = \"$URL_LINK_42\";\n\n" >> /app/website/tmp.js

WORKDIR /app/website/assets

RUN cat index.js >> ../tmp.js && rm index.js && mv ../tmp.js index.js

WORKDIR /app

RUN npm install

STOPSIGNAL SIGKILL

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]