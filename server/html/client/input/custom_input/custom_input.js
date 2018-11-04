'use strict';

var CUSTOM_INPUT = function(_div, action_cb) {
	var div = _div;
	var self = this;

	var content = "";

	this.write = function(s) {
		switch (s) {
		case "Enter":
			action_cb(self, content);
			break;
		default:
			content += s;
			div.innerHTML = content;
			break;
		}
		console.log("write");
	}

	this.forceEnter = function() {
		action_cb(self, content);
	}

	this.fflushContent = function() {
		content = "";
	}

	div.classList.add("custom_input");
}