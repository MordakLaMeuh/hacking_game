'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");
	right_panel.innerHTML = "Right panel string\n";

	this.post = function(str) {
		right_panel.innerHTML += str;
	}
	socket.onmessage  = function(event) {
        console.debug("WebSocket message received:", event);
    };

}