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
