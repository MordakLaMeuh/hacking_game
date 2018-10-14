var BROWSER = function(tty_key_cb) {
	var self = this;

	var go_btn = document.getElementById("go_btn");
	var bwr_content = document.getElementById("browser-container");
	var form = document.getElementById("url");

	/* Create key-value pairs with the url and matching img */
	var dict = new Object();
	dict["www.molang.com"] = "medias/macaron.jpg";
	dict["www.ours.com"] = "medias/ours.png";
	dict["www.phone.com"] = "medias/macaron.jpg";

	go_btn.addEventListener("mousedown", function () {
		var input_url = document.getElementById('url').value;
		console.log(input_url);
		if (!(input_url in dict))
			input_url = "medias/404.png";
		else
			input_url = dict[input_url];
		showImginBrowser(input_url);
	});

	form.addEventListener("focus", function( event ) {
		tty_key_cb(0);
	}, true);
	form.addEventListener("blur", function( event ) {
		tty_key_cb(1);
	}, true);

	function showImginBrowser(str) {
		document.getElementById("bwr_img").remove();
		var img = document.createElement('img');
		img.setAttribute("src", str);
		img.setAttribute("id", "bwr_img");
		bwr_content.appendChild(img);
	}
}
