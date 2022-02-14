.PHONY: all
all:
	@	docker-compose up --build

.PHONY: up
up:
	@	docker-compose up -d

.PHONY: build
build:
	@	docker-compose up -d --build --no-deps

.PHONY: down
down:
	@	docker-compose down

.PHONY: stop
stop:
	@	docker-compose stop

.PHONY: clean
clean:
	@	docker-compose down --remove-orphans -t 1
	@	-docker rm -f $(docker ps -a -q)

.PHONY: fclean
fclean:	clean
	@	-docker volume rm $(docker volume ls -q)
	@	docker-compose rm -f
	@	docker image prune --force
	@	docker volume prune --force
	@	docker network prune --force
	@	-docker rmi -f $(docker images -aq)

.PHONY: state
state:
	@	docker-compose ps --all

.PHONY: re
re:	fclean all

.PHONY: dev-back
dev-back: clean
	@	printf "Rebuilding containers...\n"
	@	docker-compose -f .docker-compose.dev.back.yml up -d --build
	@	printf	"Shell into backend_container:"
	@	docker exec -it transcendence_backend bash

.PHONY: dev-front
dev-front: clean
	@	printf "Rebuilding containers...\n"
	@	docker-compose -f .docker-compose.dev.front.yml up -d --build
	@	printf	"Shell into frontend_container:"
	@	docker exec -it transcendence_frontend bash

.PHONY: dev-both
dev-both: clean
	@	printf "Rebuilding containers...\n"
	@	docker-compose -f .docker-compose.dev.both.yml up -d --build
