FROM mariadb:latest

RUN apt update
RUN apt upgrade -y
RUN apt install mariadb-server -y

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=matcha
ENV MYSQL_USER=matcha
ENV MYSQL_PASSWORD=matcha

STOPSIGNAL SIGKILL
