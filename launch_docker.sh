#!/bin/sh
sysctl net.ipv4.ip_forward=1
iptables -P FORWARD ACCEPT
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 172.20.0.2:8080
iptables -t nat -A PREROUTING -p tcp --dport 8081 -j DNAT --to-destination 172.20.0.2:8081
iptables -t nat -A POSTROUTING -j MASQUERADE
docker network rm docker_hack_network
docker network create --subnet=172.20.0.0/24 docker_hack_network
docker build -t hack .
docker run --net docker_hack_network --ip 172.20.0.2 -t hack
exit 0
