'use strict';

var SCREEN_CONTROLER = function(displayCursor_cb) {

	var right_panel = document.getElementById("right_panel");
	var tty = document.getElementById("js_tty");
	var tabUl = document.getElementById("tabUl");


	this.switchScreen = function(target)
	{
		if (target == js_tty)
		{
			right_panel.style.display = "none";
			js_tty.style.display = "";
			displayCursor_cb(true);

		}
		else
		{
			right_panel.style.display = "block";
			js_tty.style.display = "none";
			displayCursor_cb(false);
		}
	}

	/*
	 * Make button like circle
	 */
	this.resizeButtons = function()
	{
		for (var i = 0; i < tabUl.children.length; i++) {
			tabUl.children[i].style.width = tabUl.children[i].offsetHeight + "px";
		}
	}
}
