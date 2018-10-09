'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");
	right_panel.innerHTML = "Right panel string\n";

	this.post = function(str) {
		right_panel.innerHTML += str;
	}
	this.onmessage  = function(event) {
        if (event.string)
			this.post(event.string);
    }
}