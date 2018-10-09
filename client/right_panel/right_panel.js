'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");
	var tab_field = document.getElementById("tabField");
	var mail = document.getElementById("mail");
	var browser = document.getElementById("browser");
	var social = document.getElementById("social");
	var summary = document.getElementById("summary");

	var content = document.getElementById("right_panel_content");

	mail.addEventListener("mousedown", function (){
		content.style.backgroundColor = "#FF0000";
	});

	browser.addEventListener("mousedown", function (){
		content.style.backgroundColor = "#00FF00";
	});

	social.addEventListener("mousedown", function (){
		content.style.backgroundColor = "#FFFF00";
	});

	summary.addEventListener("mousedown", function (){
		content.style.backgroundColor = "#0000FF";
	});

	this.post = function(str) {
	}
	this.onmessage  = function(data) {
		if (data.victory)
			this.post(data.victory);
	}
}