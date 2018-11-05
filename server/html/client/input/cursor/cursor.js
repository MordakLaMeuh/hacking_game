'use strict';

var CURSOR = function() {
	var cursor = document.createElement('canvas');
	cursor.id = "cursor";

	var interval;
	var displayed = false;

	this.activeCursor = function(isActive) {
		if (isActive == false) {
			cursor.style.display = "none";
			window.clearInterval(interval);
		} else {
			cursor.style.display = "block";
			displayed = true;
			window.clearInterval(interval)
			interval = window.setInterval(function(){
				if (displayed == true) {
					cursor.style.display = "none";
					displayed = false;
				} else {
					cursor.style.display = "block";
					displayed = true;
				}
			}, 200);
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
