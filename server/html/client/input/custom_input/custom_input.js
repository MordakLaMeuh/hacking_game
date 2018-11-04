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

	var visibleStringLen = 0;

	var CHAR_HEIGHT = 0;
	var CHAR_WIDTH = 0;
	var NBLETTER = 0;

	var cursorPosition;
	var visibleCursorPosition;

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
				if (cursorPosition - idx == space_expr.length && idx != -1)
					len = space_expr.length;
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
	}

	/*
	 * The focus() function is done at a specified position pointed by mouse
	 */
	this.focus = function(x, y) {
		cursor.activeCursor(true);
		cursor.setCursorDim(CHAR_WIDTH, CHAR_HEIGHT);

		/*
		 * First find Visible Cursor Position
		 */
		let originX = innerDiv.offsetLeft;
		let offsetX = x - originX;
		visibleCursorPosition = Math.trunc(offsetX / CHAR_WIDTH);
		visibleCursorPosition = (visibleCursorPosition <= visibleStringLen) ? visibleCursorPosition : visibleStringLen;

		/*
		 * Now find the string cursor position, &nbsp; is exception.
		 */
		cursorPosition = 0;
		for (let i = 0; i < visibleCursorPosition; i++) {
			if (content.substring(cursorPosition, content.length).indexOf(space_expr) == 0)
				cursorPosition += space_expr.length;
			else
				cursorPosition += 1;
		}

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

		visibleStringLen = 0;
	}
}