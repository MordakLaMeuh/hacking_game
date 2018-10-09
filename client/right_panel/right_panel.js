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

	var mail_content = "Your mails:<br>";
	var browser_content = "Your browser:<br>";
	var social_content = "Your phone numbers:<br>";
	var diary_content = "Are you victorious ?<br>";

	var switchToContent = function() {
		fillContent();
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

	var fillContent = function() {
		switch (sequence) {
		case screen_enum.mail:
			content.innerHTML = mail_content;
			break;
		case screen_enum.browser:
			content.innerHTML = browser_content;
			break;
		case screen_enum.social:
			content.innerHTML = social_content;
			break;
		case screen_enum.diary:
			content.innerHTML = diary_content;
			break;
		default:
			console.log("unexpected default case");
			break;
		}
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

	summary.addEventListener("mousedown", function (){
		sequence = screen_enum.diary;
		switchToContent();
	});

	content.addEventListener("mousedown", function (){
		sequence = screen_enum.button_tab;
		switchToButtonTab();
	});

	this.onmessage  = function(data) {
		if (data.victory) {
			diary_content += data.victory + "<br>";
		}
		if (data.mail) {
			mail_content += data.mail + "<br>";
		}
		if (data.social) {
			social_content += data.social + "<br>";
		}
		if (data.browser) {
			browser_content += data.browser + "<br>";
		}
		fillContent();
	}
}