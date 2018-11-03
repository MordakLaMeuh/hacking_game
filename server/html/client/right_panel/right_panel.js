'use strict';

var RIGHT_PANEL = function(switchScreen_cb) {
	var originalHeight = window.innerHeight;
	var right_panel = document.getElementById("right_panel");
	var tty = document.getElementById("js_tty");
	var mail = document.getElementById("mail");
	var browser = document.getElementById("browser");
	var social = document.getElementById("phone");
	var diary = document.getElementById("diary");
	var tabUl = document.getElementById("tabUl");
	var TABBARHEIGHT = 10;

	console.log("origin height: " + originalHeight);

	var isMobile = function() {
		if (navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)) {
			return true;
		} else {
			return false;
		}
	}

	var hideContent = function() {
		/*
		 * Get all elements with class="tabcontent" and hide them
		 */
		var tabcontent = document.getElementsByClassName("tabcontent");
		for (var i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
	}

	function changeScreen(button, target) {
		console.log("On right panel");

		if (isMobile())
			switchScreen_cb(right_panel);

		hideContent();

		/*
		 * Show the current tab, and add an "active" class to the button that opened the tab
		 */
		document.getElementById(target).style.display = "block";
		console.log(button);

		button.classList.remove("notif");
	}

	mail_btn.addEventListener("mousedown", function (){
		changeScreen(this, "mail");
	});

	browser_btn.addEventListener("mousedown", function () {
		changeScreen(this, "browser");
	});

	social_btn.addEventListener("mousedown", function (){
		changeScreen(this, "social");
	});

	diary_btn.addEventListener("mousedown", function () {
		changeScreen(this, "diary");
	});

	if (isMobile()) {
		tty_btn.addEventListener("mousedown", function () {
			switchScreen_cb(js_tty);
			console.log("back to TTY");
		});
	}

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
			if (social_btn.classList.contains("active") == false || force == true) {
				if (state == true)
					social_btn.classList.add("notif");
				else
					social_btn.classList.remove("notif");
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

	if (!isMobile())
		changeScreen(diary_btn, "diary");
	else
		switchScreen_cb(js_tty);
}
