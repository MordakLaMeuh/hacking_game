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

	var isUpper = false;

	var switch_keyboard = function() {
		isUpper = !isUpper;
		if (isUpper == true){
			for (var i = 0, row; row = table.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					row.cells[j].innerText = maj_layout[i][j][0];
				}
			}
		}
		else {
			for (var i = 0, row; row = table.rows[i]; i++) {
				for (var j = 0, col; col = row.cells[j]; j++) {
					row.cells[j].innerText = layout[i][j][0];
				}
			}
		}
	}

	var throwInput = function(value) {
			target(value);
	}


	var layout = [
	[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
	[["q", 1], ["w", 1], ["e", 1], ["r", 1], ["t", 1], ["y", 1], ["u", 1], ["i", 1], ["o", 1], ["p", 1]],
	[["a", 1], ["s", 1], ["d", 1], ["f", 1], ["g", 1], ["h", 1], ["j", 1], ["k", 1], ["l", 1], [".", 1]],
		[["⇧", 1, switch_keyboard],["z", 1], ["x", 1], ["c", 1], ["v", 1], ["b", 1], ["n", 1], ["m", 1], ["<=", 2, "Backspace"]],
	[["/", 1], ["-", 1], ["", 6, " "], ["↲", 2, "Enter"]]];

	var maj_layout = [
		[["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1]],
		[["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1]],
		[["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [".", 1]],
		[["⇧", 1, switch_keyboard],["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], ["<=", 2, "Backspace"]],
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
				if (typeof(this.custom) == "function")
					this.custom();
				else
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