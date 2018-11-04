'use strict';

var CUSTOM_INPUT = function(_div, action_cb, _cursor) {
	var div = _div;
	div.classList.add("custom_input");

	var cursor = _cursor;

	var innerDiv = document.createElement("div");
	div.appendChild(innerDiv);

	var spanDiv = document.createElement("span");
	innerDiv.appendChild(spanDiv);

	var self = this;

	var content = "";

	const space_expr = "&nbsp;";
	const space_regex = /&nbsp;/g;

	var CHAR_HEIGHT = 0;
	var CHAR_WIDTH = 0;
	var NBLETTER = 0;
	function setNbLetter() {
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
			if (NBLETTER == 1) {
				CHAR_WIDTH = spanDiv.offsetWidth;
				CHAR_HEIGHT = spanDiv.offsetHeight;
			}
			console.log(spanDiv.offsetWidth);
		} while (spanDiv.offsetWidth <= originalWidth);
		NBLETTER -= 1;
		spanDiv.innerHTML = content;
		console.log("field can contain " + NBLETTER + " characters");
	}
	setNbLetter();

	function removeCharacters(str, char_pos, len) {
		var part1 = str.substring(0, char_pos);
		var part2 = str.substring(char_pos + len, str.length);
		return part1 + part2;
	}

	function putCursor(position) {
		var div_origin_y = innerDiv.getBoundingClientRect().top;
		var div_origin_x = innerDiv.offsetLeft;

		var x_pixel = position % NBLETTER * CHAR_WIDTH;
		var y_pixel = 0;

		cursor.setCursorPosition(div_origin_x + x_pixel, div_origin_y + y_pixel);

		console.log("new visible cur position: " + position);
	}

	var cursorPosition = 0;
	var visibleCursorPosition = 0;
	var visibleStringLen = 0;

	this.write = function(s) {
		if (s.length == 1) {
			var part1 = content.substring(0, cursorPosition);
			console.log("part_1: '" + part1 + "'");

			var part2 = content.substring(cursorPosition, content.length);
			console.log("part_2: '" + part2 + "'");

			if (s == " ") {
				s = space_expr;
				cursorPosition += space_expr.length;
			} else {
				cursorPosition += 1;
			}
			visibleCursorPosition += 1;
			visibleStringLen += 1;

			content = part1 + s + part2;

			spanDiv.innerHTML = content;

			putCursor(visibleCursorPosition);
		}

		switch (s) {
		case "Backspace":
			if (cursorPosition != 0) {
				let idx = content.substring(0, cursorPosition).lastIndexOf(space_expr);
				let len;
				if (cursorPosition - idx == space_expr.length && idx != -1) {
					console.log("specialCase");
					len = space_expr.length;
				}
				else
					len = 1;
				cursorPosition -= len;

				visibleCursorPosition -= 1;
				visibleStringLen -= 1;

				content = removeCharacters(content, cursorPosition, len);

				spanDiv.innerHTML = content;
				putCursor(visibleCursorPosition);
			}
			break;
		case "ArrowRight":
			if (cursorPosition < content.length) {
				let idx = content.substring(cursorPosition, content.length).indexOf(space_expr);
				if (idx == 0)
					cursorPosition += space_expr.length;
				else
					cursorPosition += 1;

				visibleCursorPosition += 1;
				putCursor(visibleCursorPosition);
			}
			break;
		case "ArrowLeft":
			if (cursorPosition != 0) {
				let idx = content.substring(0, cursorPosition).lastIndexOf(space_expr);
				if (cursorPosition - idx == space_expr.length && idx != -1)
					cursorPosition -= space_expr.length;
				else
					cursorPosition -= 1;

				visibleCursorPosition -= 1;
				putCursor(visibleCursorPosition);
			}
			break;
		case "Enter":
			action_cb(self, content.replace(space_regex, " "));
			break;
		default:
			break;
		}
		console.log("write");
	}

	this.focus = function() {
		cursor.activeCursor(true);
		console.log(CHAR_WIDTH + " " + CHAR_HEIGHT)
		cursor.setCursorDim(CHAR_WIDTH, CHAR_HEIGHT);
		putCursor(visibleCursorPosition);
	}

	this.blur = function() {
		cursor.activeCursor(false);
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

		cursorPosition = 0;
		visibleCursorPosition = 0;
		visibleStringLen = 0;
	}
}