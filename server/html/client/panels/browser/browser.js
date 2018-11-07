'use strict';

var BROWSER = function(keyboard, cursor, tty_key_cb) {
	var self = this;

	if (IS_MOBILE == false) {
		browser_url_bar.innerHTML +=
		`<input id='url' type='text' onfocus=\"this.value=''\" spellcheck='false' autocorrect='off' autocapitalize='none' autocomplete='off' name='url' value='enter your URL' />
		<input id='go_btn' type='submit' value='Go' />`;

		var form = document.getElementById("url");
		var go_btn = document.getElementById("go_btn");

		go_btn.addEventListener("mousedown", function () {
			let input_url = form.value;
			if (!(input_url in dict))
				input_url = "medias/404.png";
			else
				input_url = dict[input_url];
			showImginBrowser(input_url);
		});

		form.addEventListener("focus", function() {
			tty_key_cb(0);
		}, true);
		form.addEventListener("blur", function() {
			tty_key_cb(1);
		}, true);

		form.addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.key === "Enter") {
				let input_url = form.value;
				if (!(input_url in dict))
					input_url = "medias/404.png";
				else
					input_url = dict[input_url];
				showImginBrowser(input_url);
		}});
	} else {
		browser_url_bar.innerHTML +=
		`<div id="url" class="custom_input_text"></div>
		<div id="go_btn" class="custom_input_submit">GO</div>`

		function closeKeyboard() {
			panels.style.height = "calc(var(--vh, 1vh) * 90)";
			browser.style.height = "calc(var(--vh, 1vh) * 90)";
			keyboard.close();
			cursor.activeCursor(false);
		}

		function action(self, str) {
			console.info("validation custom_input browser");
			closeKeyboard();
			if (str.trim().length != 0) {
				let input_url = str;
				if (!(input_url in dict))
					input_url = "medias/404.png";
				else
					input_url = dict[input_url];
				showImginBrowser(input_url);
			}
		}

		let input = new CUSTOM_INPUT(url, action, cursor);

		this.setActive = function() {
			input.calibrate();
		}

		this.setInactive = function() {
			closeKeyboard();
		}

		browser.addEventListener("mousedown", function(e) {
			closeKeyboard();
		}, false);

		url.addEventListener("mousedown", function(e){
			panels.style.height = "calc(var(--vh, 1vh) * 50)";
			browser.style.height = "calc(var(--vh, 1vh) * 50)";
			input.focus(e.clientX, e.clientY);
			keyboard.open(input.write);
			e.stopPropagation();
		}, false);

		document.getElementById("go_btn").addEventListener("mousedown", function(e){
			action(input, input.getContent());
			e.stopPropagation();
		}, false);
	}

	var bwr_content = document.getElementById("browser-container");

	/* Create key-value pairs with the url and matching img */
	var dict = new Object();
	dict["www.fakebook.com/vyoung"] = "medias/victor.jpeg";
	dict["www.ours.com"] = "medias/ours.png";
	dict["www.molang.com"] = "medias/macaron.jpg";
	dict["www.big.com"] = "medias/big.png";

	function showImginBrowser(str) {
		document.getElementById("bwr_img").remove();
		let img = document.createElement('img');
		img.setAttribute("src", str);
		img.setAttribute("id", "bwr_img");
		bwr_content.appendChild(img);
	}

	bwr_content.addEventListener(mousewheelevt, function (e) {
		e = window.event || e; // old IE support
		let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		bwr_content.scrollTop -= delta * 50;
}, false);

}
