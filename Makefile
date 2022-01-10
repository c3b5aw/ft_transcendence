.PHONY: all
all: up

.PHONY: up
up:
	@	docker-compose up -d

.PHONY: build
build:
	@	docker-compose up -d --build

.PHONY: down
down:
	@	docker-compose down

.PHONY: stop
stop:
	@	docker-compose stop

.PHONY: clean
clean:
	@	docker-compose down --remove-orphans -t 1
	@	docker-compose rm -f

.PHONY: state
state:
	@	docker-compose ps --all

.PHONY: dev-back
dev-back:
	@	printf "Rebuilding containers...\n"
	@	docker-compose -f .docker-compose.dev.back.yml up -d --build
	@	printf	"Shell into backend_container:"
	@	docker exec -it transcendence_backend bash

.PHONY: dev-front
dev-front:
	@	printf "Rebuilding containers...\n"
	@	docker-compose -f .docker-compose.dev.front.yml up -d --build
	@	printf	"Shell into frontend_container:"
	@	docker exec -it transcendence_frontend bash