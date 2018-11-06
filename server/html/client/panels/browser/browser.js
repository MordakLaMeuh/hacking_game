'use strict';

var BROWSER = function(tty_key_cb) {
	var self = this;

	var go_btn = document.getElementById("go_btn");
	var bwr_content = document.getElementById("browser-container");
	var form = document.getElementById("url");

	/* Create key-value pairs with the url and matching img */
	var dict = new Object();
	dict["www.fakebook.com/vyoung"] = "medias/victor.jpeg";
	dict["www.ours.com"] = "medias/ours.png";
	dict["www.molang.com"] = "medias/macaron.jpg";
	dict["www.big.com"] = "medias/big.png";

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
