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

	const nbsp_space_expr = "&nbsp;";
	const common_space_regex = / /g;

	var CHAR_HEIGHT = 0;
	var CHAR_WIDTH = 0;
	var NBLETTER = 0;

	var cursorPosition;

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
		} while (spanDiv.offsetWidth <= originalWidth);
		NBLETTER -= 1;
		spanDiv.innerHTML = content;
		console.log("field can contain " + NBLETTER + " characters");
	}
	setNbLetter();

	function removeCharacters(str, char_pos, len) {
		let part1 = str.substring(0, char_pos);
		let part2 = str.substring(char_pos + len, str.length);
		return part1 + part2;
	}

	function putCursor(position) {
		let div_origin_y = innerDiv.getBoundingClientRect().top;
		let div_origin_x = innerDiv.offsetLeft;

		let x_pixel = position % NBLETTER * CHAR_WIDTH;
		let y_pixel = 0;

		cursor.setCursorPosition(div_origin_x + x_pixel, div_origin_y + y_pixel);
	}

	this.write = function(s) {
		if (s.length == 1) {
			let part1 = content.substring(0, cursorPosition);
			let part2 = content.substring(cursorPosition, content.length);

			cursorPosition += 1
			content = part1 + s + part2;

			spanDiv.innerHTML = content.replace(common_space_regex, nbsp_space_expr);
			putCursor(cursorPosition);
		}

		switch (s) {
		case "Backspace":
			if (cursorPosition != 0) {
				cursorPosition -= 1;
				content = removeCharacters(content, cursorPosition, 1);
				spanDiv.innerHTML = content.replace(common_space_regex, nbsp_space_expr);
				putCursor(cursorPosition);
			}
			break;
		case "ArrowRight":
			if (cursorPosition < content.length) {
				cursorPosition += 1
				putCursor(cursorPosition);
			}
			break;
		case "ArrowLeft":
			if (cursorPosition != 0) {
				cursorPosition -= 1;
				putCursor(cursorPosition);
			}
			break;
		case "Enter":
			action_cb(self, content);
			break;
		default:
			break;
		}
	}

	/*
	 * The focus() function is done at a specified position pointed by mouse
	 */
	this.focus = function(x, y) {
		cursor.activeCursor(true);
		cursor.setCursorDim(CHAR_WIDTH, CHAR_HEIGHT);

		/*
		 * find Cursor Position
		 */
		let originX = innerDiv.offsetLeft;
		let offsetX = x - originX;
		cursorPosition = Math.trunc(offsetX / CHAR_WIDTH);
		cursorPosition = (cursorPosition <= content.length) ? cursorPosition : content.length;

		putCursor(cursorPosition);
	}

	this.blur = function() {
		cursor.activeCursor(false);
	}

	this.forceEnter = function() {
		action_cb(self, content);
	}

	this.getContent = function() {
		return content;
	}

	this.fflushContent = function() {
		content = "";
		spanDiv.innerHTML = content;
	}
}