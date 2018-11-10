'use strict';

var SOCKET_CLIENT = function() {
    console.info("socket_client constructor");

    var socket;
    var client_list = new Array();

    function functionalProperty(client_record, idx, data) {
        if (idx == client_record.arrString.length) {
            client_record.cb(data);
            return;
        }

        if (data.hasOwnProperty(client_record.arrString[idx])) {
            let sub_data = data[client_record.arrString[idx]];
            functionalProperty(client_record, idx + 1, sub_data);
        }
    }

    function dispatch(data) {
        client_list.forEach(function(client_record) {
            functionalProperty(client_record, 0, data);
        });
    }

    this.connect = function(url) {
        console.info("socket_client connect(" + url + ")");

        socket = new WebSocket(url);

        socket.onmessage = function(res) {
    		let data = JSON.parse(res.data);
            console.log(data);

            dispatch(data);
        }

        socket.onerror = function() {
    		console.warn("Aucune reponse du serveur");
    	}

        console.info("socket client_list:");
        console.info(client_list);
    }

    this.register = function(arrString, cb) {
        console.info("socket client registering: " + arrString.toString());

        let obj = new Object();
        obj.arrString = arrString;
        obj.cb = cb;
        client_list.push(obj);
    }

    this.send = function(content) {
        socket.send(content);
    }
}
