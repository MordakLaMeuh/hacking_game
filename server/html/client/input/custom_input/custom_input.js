'use strict';

var CUSTOM_INPUT = function(_div) {
	var div = _div;

	this.write = function(c) {
		console.log("write");
	}
	div.classList.add("custom_input");
}