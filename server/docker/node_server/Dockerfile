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

WORKDIR /app

RUN npm install

STOPSIGNAL SIGKILL

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]