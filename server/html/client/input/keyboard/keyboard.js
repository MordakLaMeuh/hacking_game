'use strict';

var KEYBOARD = function() {
	var keyboardDiv = document.getElementById("keyboard");

	var target = undefined;
	this.open = function(targetField) {
		console.log("open Keyboard");
		target = targetField;

		let tables = keyboardDiv.getElementsByTagName("table");
		tables[0].classList.remove("hidden");
		for (let i = 1; i < tables.length; i++)
			tables[i].classList.add("hidden");
		keyboardDiv.classList.remove("hidden");
	}

	this.close = function() {
		console.log("close Keyboard");
		stopAutorepeat();
		keyboardDiv.classList.add("hidden");
		target = undefined;
	}

	var throwInput = function(value) {
		target(value);
	}

	var switchLayout = function() {
		console.log("switch_layout");

		let tables = keyboardDiv.getElementsByTagName("table");
		for (let i = 0; i < tables.length; i++)
		{
			if (tables[i].classList.contains("hidden"))
				tables[i].classList.remove("hidden");
			else
				tables[i].classList.add("hidden");
		}
	}

	var layout = [
		[[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
			[["q", 1], ["w", 1], ["e", 1], ["r", 1], ["t", 1], ["y", 1], ["u", 1], ["i", 1], ["o", 1], ["p", 1]],
			[["a", 1], ["s", 1], ["d", 1], ["f", 1], ["g", 1], ["h", 1], ["j", 1], ["k", 1], ["l", 1], [".", 1]],
			[["⇧", 1, switchLayout],["z", 1], ["x", 1], ["c", 1], ["v", 1], ["b", 1], ["n", 1], ["m", 1], ["<=", 2, "Backspace"]],
			[["<-", 1, "ArrowLeft"], ["->", 1, "ArrowRight"], ["", 6, " "], ["↲", 2, "Enter"]]],
		[[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
			[["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1]],
			[["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [".", 1]],
			[["⇧", 1, switchLayout],["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], ["<=", 2, "Backspace"]],
			[["<-", 1, "ArrowLeft"], ["->", 1, "ArrowRight"], ["", 6, " "], ["↲", 2, "Enter"]]]];

	let evtDown = (isMobile() == true) ? "touchstart" : "mousedown";
	let evtUp = (isMobile() == true) ? "touchend" : "mouseup";

	let interval = -1;

	function beginAutorepeat(s) {
		if (interval != -1)
			return;
		interval = window.setInterval(function() {
			throwInput(s);
		}, 150);
	}

	function stopAutorepeat() {
		window.clearInterval(interval);
		interval = -1;
	}

	layout.forEach(function(subLayout) {
		let table = document.createElement("table");
		subLayout.forEach(function(row) {
			let tr = document.createElement("tr");
			row.forEach(function(cell) {
				let td = document.createElement("td");
				let text = document.createTextNode(cell[0]);

				if (cell.length == 2)
					td.custom = cell[0];
				else
					td.custom = cell[2];

				td.addEventListener(evtDown, function(){
					if (typeof(this.custom) == "function") {
						this.custom();
					} else {
						beginAutorepeat(this.custom);
						throwInput(this.custom);
					}
				});
				td.addEventListener(evtUp, function(){
					stopAutorepeat();
				});
				td.addEventListener("mouseup", function(){
					stopAutorepeat();
				});

				td.appendChild(text);
				td.setAttribute("colspan", cell[1]);
				tr.appendChild(td);
				console.log(cell);
			});
			table.appendChild(tr);
		});
		keyboardDiv.appendChild(table);
	});
	console.log(layout);

	/*
	 * Binding of natural keyboard
	 */
	document.addEventListener("keydown", function(event) {
		if (target === undefined) {
			console.log("undefined target");
			return;
		}
		let key = event.key;
		console.log(key);
		/*
		 * Prevent the quick search feature on Firefox triggered by /
		 */
		if (key == "/") {
			event.stopPropagation();
			event.preventDefault();
		}

		if (key == "Backspace") {
			event.stopPropagation();
			event.preventDefault();
		}
		throwInput(key);
	});
}
