up:
	docker-compose up -d

build:
	@	printf "\033[31m /!\ Unsafe build command /!\ \033[0m\n"
	docker-compose up -d --build

down:
	docker-compose down

stop:
	docker-compose stop

clean:
	docker-compose down --remove-orphans -t 1
	docker-compose rm -f

state:
	docker-compose ps --all