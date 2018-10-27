FROM node

WORKDIR /app
COPY . /app

ENTRYPOINT ["/app/launch_server.sh"]
