FROM node

WORKDIR /app
COPY . /app

ENTRYPOINT ["/app/docker_entry_point.sh"]
