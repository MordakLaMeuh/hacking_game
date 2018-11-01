'use strict';

var KEYBOARD = function() {
	var keyboardDiv = document.getElementById("keyboard");

	var target;
	this.open = function(targetField) {
		console.log("open Keyboard");
		target = targetField;
		keyboardDiv.classList.remove("hidden");
	}

	this.close = function() {
		console.log("close Keyboard");
		keyboardDiv.classList.add("hidden");
	}
}