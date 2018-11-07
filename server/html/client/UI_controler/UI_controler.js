'use strict';

var UI_CONTROLER = function(tty_display_cb, browser, mail, tty) {
	/*
	 * Make button like circle
	 * BUG Resize is not trigger since iframe window doesn't detect any resize. Event
	 * is triggered by parent.
	 */
	this.resizeButtons = function()
	{
		for (let i = 0; i < tabUl.children.length; i++) {
			tabUl.children[i].style.width = tabUl.children[i].offsetHeight + "px";
		}
	}

	/*
	 * Launch notification animation when a notification is received
	 */
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

	var lastScreen = undefined;

	/*
	 * Global switch screen on mobile
	 */
	function switchScreen(target) {

		/*
		 * Disable current panel
		 */
		switch (lastScreen) {
		case "browser":
			browser.setInactive();
			break;
		case "mail":
			mail.setInactive();
			break;
		case "tty":
			tty.setInactive();
			break;
		default:
			console.warn("unknown last screen");
			break;
		}

		if (target == js_tty) {
			panels.style.display = "none";
			js_tty.style.display = "";
			tty_display_cb(true);

		} else {
			panels.style.display = "block";
			js_tty.style.display = "none";
			tty_display_cb(false);
		}
	}

	function changeScreen(button, target) {
		console.log("On right panel");

		if (IS_MOBILE == true) {
			switchScreen(panels);
		}

		/*
		 * Get all elements with class="tabcontent" and hide them
		 */
		let tabcontent = document.getElementsByClassName("tabcontent");
		for (let i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		/*
		 * Show the current tab, and add an "active" class to the button that opened the tab
		 */
		document.getElementById(target).style.display = "block";
		console.log(button);

		button.classList.remove("notif");
	}

	/*
	 * UI_controler button binding
	 */
	mail_btn.addEventListener("mousedown", function (){
		changeScreen(this, "mail");
		if (IS_MOBILE == true) {
			mail.setActive();
			lastScreen = "mail";
		}
	});

	browser_btn.addEventListener("mousedown", function () {
		changeScreen(this, "browser");
		if (IS_MOBILE == true) {
			browser.setActive();
			lastScreen = "browser";
		}
	});

	social_btn.addEventListener("mousedown", function (){
		changeScreen(this, "social");
	});

	diary_btn.addEventListener("mousedown", function () {
		changeScreen(this, "diary");
	});

	if (IS_MOBILE == true) {
		tty_btn.addEventListener("mousedown", function () {
			switchScreen(js_tty);
			lastScreen = "tty";
			console.log("back to TTY");
		});
	}

	/*
	 * On desktop, default panel is diary, tty is always visible.
	 * On mobile, the default panel is tty
	 */
	if (IS_MOBILE == false)
		changeScreen(diary_btn, "diary");
	else {
		switchScreen(js_tty);
		lastScreen = "tty";
	}
}
