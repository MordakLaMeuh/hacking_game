#!/bin/bash

trap "kill 0" EXIT

(cd ./server/websocket/; node websocket_server.js ) &
(cd ./server/html/ ; node http_server.js) & 

wait
