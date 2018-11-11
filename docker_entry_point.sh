#!/bin/bash

trap "kill 0" EXIT

(cd ./server/html/ ; node http_server.js) &

wait
