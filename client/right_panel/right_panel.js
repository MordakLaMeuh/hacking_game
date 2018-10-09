'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");
	var button_tab = document.getElementById("right_panel_button_tab");

	var mail = document.getElementById("mail");
	var browser = document.getElementById("browser");
	var social = document.getElementById("social");
	var summary = document.getElementById("summary");

	var content = document.getElementById("right_panel_content");

	const screen_enum = {
		"button_tab": 0,
		"mail": 1,
		"browser": 2,
		"social": 3,
		"diary": 4,
	}
	var sequence = screen_enum.button_tab;

	var switchToContent = function() {
		button_tab.style.opacity = 0;
		content.style.opacity = 1;
		button_tab.style.zIndex = -1;
		content.style.zIndex = 0;
	}

	var switchToButtonTab = function() {
		button_tab.style.opacity = 1;
		content.style.opacity = 0;
		button_tab.style.zIndex = 0;
		content.style.zIndex = -1;
	}

	mail.addEventListener("mousedown", function (){
		sequence = screen_enum.mail;
		switchToContent();
	});

	browser.addEventListener("mousedown", function (){
		sequence = screen_enum.browser;
		switchToContent();
	});

	social.addEventListener("mousedown", function (){
		sequence = screen_enum.social;
		switchToContent();
	});

	var diary_content = "";
	summary.addEventListener("mousedown", function (){
		sequence = screen_enum.diary;
		content.innerHTML = diary_content;
		switchToContent();
	});

	content.addEventListener("mousedown", function (){
		sequence = screen_enum.button_tab;
		switchToButtonTab();
	});

	this.post = function(str) {
		console.log("Upgrading of diary_content");

		diary_content += str + "<br>";
		if (sequence == screen_enum.diary)
			content.innerHTML = diary_content;
	}

	this.onmessage  = function(data) {
		if (data.victory)
			this.post(data.victory);
	}
}