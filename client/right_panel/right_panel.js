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

	var switchToContent = function () {
		fillContent();
		button_tab.style.opacity = 0;
		content.style.opacity = 1;
		button_tab.style.zIndex = -1;
		content.style.zIndex = 0;
	}

	var switchToButtonTab = function () {
		button_tab.style.opacity = 1;
		content.style.opacity = 0;
		button_tab.style.zIndex = 0;
		content.style.zIndex = -1;
	}

	var fillContent = function () {
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

	function changeScreen(button, target) {
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].classList.remove("active");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(target).style.display = "block";
		button.classList.add("active");
		console.log(button);
	}

	mail_btn.addEventListener("mousedown", function (){
		changeScreen(this, "mail");
	});

	browser_btn.addEventListener("mousedown", function () {
		changeScreen(this, "browser");
	});

	sms_btn.addEventListener("mousedown", function (){
		changeScreen(this, "phone");
	});

	diary_btn.addEventListener("mousedown", function () {
		changeScreen(this, "notebook");
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
	changeScreen(diary_btn, "notebook");
}


