'use strict';

var KEYBOARD = function() {
	var keyboardDiv = document.getElementById("keyboard");

	var target;
	this.open = function(targetField) {
		console.log("open Keyboard");
		target = targetField;
		keyboardDiv.classList.remove("hidden");
	}

	this.close = function() {
		console.log("close Keyboard");
		keyboardDiv.classList.add("hidden");
	}

	var throwInput = function(value) {
		target(value);
	}

	var layout = [
	[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
	[["q", 1], ["w", 1], ["e", 1], ["r", 1], ["t", 1], ["y", 1], ["u", 1], ["i", 1], ["o", 1], ["p", 1]],
	[["a", 1], ["s", 1], ["d", 1], ["f", 1], ["g", 1], ["h", 1], ["j", 1], ["k", 1], ["l", 1], [".", 1]],
		[["⇧", 1, "x"],["z", 1], ["x", 1], ["c", 1], ["v", 1], ["b", 1], ["n", 1], ["m", 1], ["<=", 2, "Backspace"]],
	[["/", 1], ["-", 1], ["", 6, " "], ["↲", 2, "Enter"]]];


	let table = document.createElement("table");
	layout.forEach(function(row) {
		let tr = document.createElement("tr");
		row.forEach(function(cell) {
			let td = document.createElement("td");
			let text = document.createTextNode(cell[0]);

			if (cell.length == 2)
				td.custom = cell[0];
			else
				td.custom = cell[2];

			td.addEventListener("mousedown", function(){
				throwInput(this.custom);
			});


			td.appendChild(text);
			td.setAttribute("colspan", cell[1]);
			tr.appendChild(td);
			console.log(cell);
		});
		table.appendChild(tr);
	});
	keyboardDiv.appendChild(table);
	console.log(layout);
}