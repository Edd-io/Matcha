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

ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}

RUN echo '{"host": "localhost", "user": "'$MYSQL_USER'", "password": "'$MYSQL_PASSWORD'", "database": "'$MYSQL_DATABASE'"}' > /app/credentials.json

WORKDIR /app

RUN npm install

STOPSIGNAL SIGKILL

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]