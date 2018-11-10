'use strict';

var SOCKET_CLIENT = function(socket_server) {
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

    this.onmessage = function(res) {
		let data = JSON.parse(res);
        console.log(data);

        dispatch(data);
    }

    this.register = function(arrString, cb) {
        console.info("socket client registering: " + arrString.toString());

        let obj = new Object();
        obj.arrString = arrString;
        obj.cb = cb;
        client_list.push(obj);
    }

    this.send = function(content) {
        socket_server.post(content);
    }
}
