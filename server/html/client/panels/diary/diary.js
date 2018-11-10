'use strict';

var DIARY = function(notif_button_cb, socket) {
	var self = this;

	var diaryBodyDiv = document.getElementById("diary_body");

	diaryBodyDiv.addEventListener(mousewheelevt, function (e) {
		e = window.event || e; // old IE support
		let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		diaryBodyDiv.scrollTop -= delta * 20;
	}, false);

	function addEntry(data)
	{
		let title = data[0];
		let content = data[1];

		let h3 = document.createElement("h3");
		h3.classList.add("heading");
		h3.textContent = title;
		diaryBodyDiv.appendChild(h3);
		let p = document.createElement("p");
		p.textContent = content;
		diaryBodyDiv.appendChild(p);
		diaryBodyDiv.scrollTop += diaryBodyDiv.scrollHeight;

		notif_button_cb("diary", true, false);
	}

	this.active = function() {
		diaryBodyDiv.scrollTop += diaryBodyDiv.scrollHeight;
	}

	socket.register(["social", "s"], addEntry);
	socket.register(["diary"], addEntry);
}
