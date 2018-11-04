'use strict';

var CURSOR = function() {
	var cursor = document.createElement('canvas');
	cursor.id = "cursor";

	this.activeCursor = function(isActive) {
		if (isActive == false) {
			cursor.style.display = "none";
		} else {
			cursor.style.display = "block";
		}
	}

	this.setCursorDim = function(width, height) {
		cursor.style.height = height + "px";
		cursor.style.width = width + "px";
	}

	this.setCursorPosition = function(x, y) {
		cursor.style.left = x + "px";
		cursor.style.top = y + "px";
	}

	cursor.getContext('2d');
	document.body.appendChild(cursor);
}