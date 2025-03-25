# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: madegryc <madegryc@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/16 14:07:45 by edbernar          #+#    #+#              #
#    Updated: 2025/03/25 15:39:48 by madegryc         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = server/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

up: buildSvelte
	$(COMPOSE) up  --build -d

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
	cd server/requirements/node_server/App && npm install && npm run build

re: fclean all

.PHONY: all up up_att down fclean re
