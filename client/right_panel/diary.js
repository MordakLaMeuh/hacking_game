'use strict';

var DIARY = function(notif_button_cb) {
	var self = this;

	var diaryDiv = document.getElementById("diary");
	var diaryBodyDiv = document.getElementById("diary__body");

	diaryBodyDiv.addEventListener(mousewheelevt, function (e) {
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		diaryBodyDiv.scrollTop -= delta * 20;
	}, false);

	this.addEntry = function(title, content)
	{
		var h3 = document.createElement("h3");
		h3.classList.add("heading");
		h3.textContent = title;
		diaryBodyDiv.appendChild(h3);
		var p = document.createElement("p");
		p.textContent = content;
		diaryBodyDiv.appendChild(p);
		diaryBodyDiv.scrollTop += 10000;

		notif_button_cb("diary", true, false);
	}
}