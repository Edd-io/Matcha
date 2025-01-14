# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/16 14:07:45 by edbernar          #+#    #+#              #
#    Updated: 2025/01/14 15:45:15 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = server/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

up: buildSvelte
	$(COMPOSE) up  --build -d

up_att: buildSvelte
	$(COMPOSE) up --build

watch:
	$(COMPOSE) watch 

down:
	$(COMPOSE) down

clean: down
	docker system prune -af

fclean:clean
	$(COMPOSE) down -v
	docker system prune -af

buildSvelte:
	cd server/requirements/node_server/App && npm run build

re: fclean all

.PHONY: all up up_att down fclean re
