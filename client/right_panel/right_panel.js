'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");

	var mail = document.getElementById("mail");
	var browser = document.getElementById("browser");
	var social = document.getElementById("phone");
	var diary = document.getElementById("diary");
	var tabUl = document.getElementById("tabUl");

	function changeScreen(button, target) {
		var i, tabcontent, tablinks;

		/*
		 * Get all elements with class="tabcontent" and hide them
		 */
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		/*
		 * Get all elements with class="tablinks" and remove the class "active"
		 */
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].classList.remove("active");
		}

		/*
		 * Show the current tab, and add an "active" class to the button that opened the tab
		 */
		document.getElementById(target).style.display = "block";
		button.classList.add("active");
		console.log(button);

		button.classList.remove("notif");
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
		changeScreen(this, "diary");
	});

	this.notif_button_cb = function(str, state, force) {
		switch (str) {
		case "diary":
			if (diary_btn.classList.contains("active") == false || force == true) {
				if (state == true)
					diary_btn.classList.add("notif");
				else
					diary_btn.classList.remove("notif");
			}
			break;
		case "social":
			if (sms_btn.classList.contains("active") == false || force == true) {
				if (state == true)
					sms_btn.classList.add("notif");
				else
					sms_btn.classList.remove("notif");
			}
			break;
		case "mail":
			if (mail_btn.classList.contains("active") == false || force == true) {
				if (state == true)
					mail_btn.classList.add("notif");
				else
					mail_btn.classList.remove("notif");
			}
			break;
		default:
			console.warn("unexpected default case");
			break;
		}
	}

	this.onmessage  = function(data) {
		if (data.mail) {
			mail.innerhtml += data.mail + "<br>";
		}
		if (data.browser) {
			browser.innerHTML += data.browser + "<br>";
		}
	}
	changeScreen(diary_btn, "diary");

	this.resizeCircles = function()
	{
		for (var i = 0; i < tabUl.children.length; i++)
		{
			tabUl.children[i].style.height = tabUl.children[i].offsetWidth + "px";
		}
	};
}
