#
#	NODE BUILDER
#

FROM	node:16.13.1 as builder

WORKDIR /app
ENV		PATH /app/nodes_modules/.bin:$PATH

COPY	package.json package-lock.json ./
RUN		npm install --silent

COPY	. ./
RUN		npm run build

#
#	NGINX CONTAINER
#

FROM	alpine:3.13

RUN		apk update

RUN		apk add --no-cache --quiet nginx
RUN		apk add --no-cache --quiet openssl

RUN		mkdir -p /var/run/nginx

COPY	--from=builder /app/build /usr/share/nginx/html

COPY	nginx.conf /etc/nginx/conf.d/default.conf

RUN		ln -sf /dev/stdout /var/log/nginx/access.log && \
		ln -sf /dev/stderr /var/log/nginx/error.log

STOPSIGNAL SIGTERM

CMD [ "nginx", "-g", "daemon off;" ]