'use strict';

var RIGHT_PANEL = function(switchScreen_cb) {
	var right_panel = document.getElementById("right_panel");

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

		if (IS_MOBILE == true)
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

	if (IS_MOBILE == true) {
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

	if (IS_MOBILE == false)
		changeScreen(diary_btn, "diary");
	else
		switchScreen_cb(js_tty);
}
