'use strict';

var SCREEN_CONTROLER = function(displayCursor_cb) {
	this.switchScreen = function(target)
	{
		if (target == js_tty)
		{
			panels.style.display = "none";
			js_tty.style.display = "";
			displayCursor_cb(true);

		}
		else
		{
			panels.style.display = "block";
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
