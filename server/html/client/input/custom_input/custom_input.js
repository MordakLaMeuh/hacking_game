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

	const space_expr = "&nbsp;";
	const space_regex = /&nbsp;/g;

	var NBLETTER = 0;
	var setNbLetter = function() {
		/*
		 * Simulation of caracter insersion until field is completely filled
		 */
		spanDiv.innerHTML = "";
		NBLETTER = 0;
		let originalWidth = innerDiv.offsetWidth;
		if (originalWidth == 0 || originalWidth === undefined) {
			console.warn("Cannot measure offsetWidth");
			return;
		}
		do {
			NBLETTER += 1;
			spanDiv.innerHTML += "x";
			console.log(spanDiv.offsetWidth);
		} while (spanDiv.offsetWidth <= originalWidth);
		NBLETTER -= 1;
		spanDiv.innerHTML = content;
		console.log("field can contain " + NBLETTER + " characters");
	}
	setNbLetter();

	this.write = function(s) {
		switch (s) {
		case "Enter":
			action_cb(self, content.replace(space_regex, " "));
			break;
		default:
			if (s == " ") {
				s = space_expr;
			}
			content += s;
			spanDiv.innerHTML = content;
			break;
		}
		console.log("write");
	}

	this.forceEnter = function() {
		action_cb(self, content.replace(space_regex, " "));
	}

	this.getContent = function() {
		return content.replace(space_regex, " ");
	}

	this.fflushContent = function() {
		content = "";
		spanDiv.innerHTML = content;
	}
}