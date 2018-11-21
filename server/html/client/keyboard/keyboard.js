'use strict';

var KEYBOARD = function() {
	var keyboardDiv = document.getElementById("keyboard");

	console.info("Keyboard constructor called: registering layout");

	var target = undefined;

	this.open = function(targetField) {
		console.log("open Keyboard");
		target = targetField;

		isMaj = false;
		isSymbol = false;
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

	function throwInput(value) {
		target(value);
	}

	let isMaj;
	let isSymbol;

	function switchMaj() {
		console.log("switch_Maj");

		let tables = keyboardDiv.getElementsByTagName("table");

		for (let i = 0; i < tables.length; i++)
			tables[i].classList.add("hidden");

		if (isMaj == false) {
			tables[1].classList.remove("hidden");
			isMaj = true;
		} else {
			tables[0].classList.remove("hidden");
			isMaj = false;
		}
		isSymbol = false;
	}

	function switchSymbol() {
		console.log("switch_Symbol");

		let tables = keyboardDiv.getElementsByTagName("table");

		for (let i = 0; i < tables.length; i++)
			tables[i].classList.add("hidden");

		if (isSymbol == false) {
			tables[2].classList.remove("hidden");
			isSymbol = true;
		} else {
			if (isMaj == false) {
				tables[0].classList.remove("hidden");
			} else {
				tables[1].classList.remove("hidden");
			}
			isSymbol = false;
		}
	}

	var layout = [
		[[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
			[["q", 1], ["w", 1], ["e", 1], ["r", 1], ["t", 1], ["y", 1], ["u", 1], ["i", 1], ["o", 1], ["p", 1]],
			[["a", 1], ["s", 1], ["d", 1], ["f", 1], ["g", 1], ["h", 1], ["j", 1], ["k", 1], ["l", 1], [".", 1]],
			[["⇧", 1, switchMaj],["z", 1], ["x", 1], ["c", 1], ["v", 1], ["b", 1], ["n", 1], ["m", 1], ["<=", 2, "Backspace"]],
			[["Ӫ", 1, switchSymbol], ["/", 1], ["-", 1], ["", 5, " "], ["↲", 2, "Enter"]]],
		[[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
			[["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1]],
			[["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [".", 1]],
			[["⇧", 1, switchMaj],["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], ["<=", 2, "Backspace"]],
			[["Ӫ", 1, switchSymbol], ["/", 1], ["-", 1], ["", 5, " "], ["↲", 2, "Enter"]]],
		[[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
			[["?", 1], ["!", 1], [",", 1], [";", 1], [".", 1], ["$", 1], ["%", 1], ["§", 1], ["µ", 1], ["@", 1]],
			[["+", 1], ["-", 1], ["*", 1], ["/", 1], ["(", 1], [")", 1], ["{", 1], ["}", 1], ["[", 1], ["]", 1]],
			[["⇧", 1, switchMaj],["↑", 1, "ArrowUp"], ["↓", 1, "ArrowDown"], ["&", 1], ["~", 1], ["#", 1], ["'", 1], ["⇆", 1, "Tab"], ["<=", 2, "Backspace"]],
			[["ʩ", 1, switchSymbol], ["←", 1, "ArrowLeft"], ["→", 1, "ArrowRight"], ["", 5, " "], ["↲", 2, "Enter"]]]];

	let evtDown = (IS_MOBILE == true) ? "touchstart" : "mousedown";
	let evtUp = (IS_MOBILE == true) ? "touchend" : "mouseup";

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
			return;
		}
		let key = event.key;
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
