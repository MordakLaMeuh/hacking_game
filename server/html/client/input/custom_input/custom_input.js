'use strict';

var CUSTOM_INPUT = function(_div, action_cb) {
	var div = _div;
	div.classList.add("custom_input");

	var innerDiv = document.createElement("div");
	div.appendChild(innerDiv);

	var spanDiv = document.createElement("span");
	innerDiv.appendChild(spanDiv);

	var self = this;

	var content = "";

	var NBLETTER = 0;
	var setNbLetter = function() {
		/*
		 * Simulation of caracter insersion until field is completely filled
		 */
		spanDiv.textContent = "";
		NBLETTER = 0;
		let originalWidth = innerDiv.offsetWidth;
		if (originalWidth == 0 || originalWidth === undefined) {
			console.warn("Cannot measure offsetWidth");
			return;
		}
		do {
			NBLETTER += 1;
			spanDiv.textContent += "x";
			console.log(spanDiv.offsetWidth);
		} while (spanDiv.offsetWidth <= originalWidth);
		NBLETTER -= 1;
		spanDiv.textContent = content;
		console.log("field can contain " + NBLETTER + " characters");
	}
	setNbLetter();

	this.write = function(s) {
		switch (s) {
		case "Enter":
			action_cb(self, content);
			break;
		default:
			content += s;
			spanDiv.textContent = content;
			break;
		}
		console.log("write");
	}

	this.forceEnter = function() {
		action_cb(self, content);
	}

	this.getContent = function() {
		return content;
	}

	this.fflushContent = function() {
		content = "";
		spanDiv.textContent = content;
	}
}