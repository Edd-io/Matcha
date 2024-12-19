FROM nginx:stable 

RUN apt update
RUN apt upgrade -y
RUN apt install openssl nginx -y

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -out /etc/nginx/ssl/matcha.crt -keyout /etc/nginx/ssl/matcha.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=matcha.com/UID=matcha"

COPY nginx.conf /etc/nginx/nginx.conf
COPY static /var/www/static

STOPSIGNAL SIGKILL

ENTRYPOINT ["nginx", "-g", "daemon off;"]
