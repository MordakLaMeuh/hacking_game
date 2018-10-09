var socket  = new WebSocket('ws://localhost:8081');

var TTY = function() {

	var tty = document.getElementById("js_tty");
	tty.innerHTML = "";

	tty.addEventListener(mousewheelevt, function (e) {
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		tty.scrollTop -= delta * 20;
	}, false);

	const space_expr = "&nbsp;";
	const space_regex = /&nbsp;/g;

	var inputHistory = new Array();
	var historyIdx;

	var inputString;
	var inputDiv;
	var cursorPosition;
	var systemInputMsg;

	var isChrome = !!window.chrome && !!window.chrome.webstore;
	if (isChrome) {
		var LETTERSIZE = 12.04;
		var NBLETTERPERLINE = 99;
	}
	else {
		var LETTERSIZE = 12;
		var NBLETTERPERLINE = 100;
	}


	/*
	 * visible len and cursor position, avoid exeption of &nbsp;
	 */
	var visibleCursorPosition;
	var visibleStringLen;

	var putCursor = function (position) {
		var div_origin_y = inputDiv.getBoundingClientRect().top;
		var div_origin_x = inputDiv.offsetLeft;
		var div_width = inputDiv.offsetWidth;

		var x_pixel = position % Math.trunc(div_width / LETTERSIZE) * LETTERSIZE;
		var y_pixel = Math.trunc(position / Math.trunc(div_width / LETTERSIZE)) * 24;

		cursor.style.left = div_origin_x + x_pixel + "px";
		cursor.style.top = div_origin_y + y_pixel + "px";

		console.log("new visible cur position: " + position);
	}

	var createNewInputString = function (prompt, optionalStr) {
		systemInputMsg = prompt;
		inputString = systemInputMsg;
		if (optionalStr)
			inputString += optionalStr;
		cursorPosition = inputString.length;
		inputDiv = document.createElement('div');

		visibleCursorPosition = inputString.replace(space_regex, " ").length;
		visibleStringLen = visibleCursorPosition;

		if ((visibleStringLen % NBLETTERPERLINE == 0) &&
			(visibleCursorPosition % NBLETTERPERLINE == 0) &&
			visibleStringLen == visibleCursorPosition)
			inputDiv.innerHTML = inputString + space_expr;
		else
			inputDiv.innerHTML = inputString;

		tty.appendChild(inputDiv);

		tty.scrollTop += 10000;
		putCursor(visibleCursorPosition);
	}

	var createDiv = function (content) {
		outputDiv = document.createElement('div');
		outputDiv.innerHTML = content;
		tty.appendChild(outputDiv);

		tty.scrollTop += 10000;
	}

	var refreshInput = function (inputDiv, optionalStr) {
		tty.removeChild(inputDiv);
		if (optionalStr)
			inputDiv.innerHTML = inputString + optionalStr;
		else
			inputDiv.innerHTML = inputString;
		tty.appendChild(inputDiv);

		tty.scrollTop += 10000;
	}

	function removeCharacters(str, char_pos, len) {
		part1 = str.substring(0, char_pos);
		part2 = str.substring(char_pos + len, str.length);
		return part1 + part2;
	}

	document.addEventListener('keydown', (event) => {
		key = event.key;

		/*
		 * Prevent the quick search feature on Firefox triggered by /
		 */
		if (key == "/") {
			event.stopPropagation();
			event.preventDefault();
		}

		if (key.length == 1) {
			part1 = inputString.substring(0, cursorPosition);
			console.log("part_1: '" + part1 + "'");

			part2 = inputString.substring(cursorPosition, inputString.length);
			console.log("part_2: '" + part2 + "'");

			if (key == " ") {
				key = space_expr;
				cursorPosition += space_expr.length;
			} else {
				cursorPosition += 1;
			}
			visibleCursorPosition += 1;
			visibleStringLen += 1;

			inputString = part1 + key + part2;

			if ((visibleStringLen % NBLETTERPERLINE == 0) &&
				(visibleCursorPosition % NBLETTERPERLINE == 0) &&
				visibleStringLen == visibleCursorPosition)
				refreshInput(inputDiv, space_expr);
			else
				refreshInput(inputDiv);
			putCursor(visibleCursorPosition);

			historyIdx = inputHistory.length;
		}

		switch (key) {
			case "Backspace":
				if (cursorPosition != systemInputMsg.length) {
					var idx = inputString.substring(0, cursorPosition).lastIndexOf(space_expr);
					var len;
					if (cursorPosition - idx == space_expr.length)
						len = space_expr.length;
					else
						len = 1;
					cursorPosition -= len;

					visibleCursorPosition -= 1;
					visibleStringLen -= 1;

					inputString = removeCharacters(inputString, cursorPosition, len);

					if ((visibleStringLen % NBLETTERPERLINE == 0) &&
						(visibleCursorPosition % NBLETTERPERLINE == 0) &&
						visibleStringLen == visibleCursorPosition)
						refreshInput(inputDiv, space_expr);
					else
						refreshInput(inputDiv);
					putCursor(visibleCursorPosition);

					historyIdx = inputHistory.length;
				} else {
					refreshInput(inputDiv);
				}
				break;
			case "Enter":
				process(inputString.slice(systemInputMsg.length));
				break;
			case "ArrowRight":
				if (cursorPosition < inputString.length) {
					var idx = inputString.substring(cursorPosition, inputString.length).indexOf(space_expr);
					if (idx == 0)
						cursorPosition += space_expr.length;
					else
						cursorPosition += 1;

					visibleCursorPosition += 1;
					putCursor(visibleCursorPosition);

					historyIdx = inputHistory.length;
				}
				break;
			case "ArrowLeft":
				if (cursorPosition != systemInputMsg.length) {
					var idx = inputString.substring(0, cursorPosition).lastIndexOf(space_expr);
					if (cursorPosition - idx == space_expr.length)
						cursorPosition -= space_expr.length;
					else
						cursorPosition -= 1;

					visibleCursorPosition -= 1;
					putCursor(visibleCursorPosition);

					historyIdx = inputHistory.length;
				}
				break;
			case "ArrowUp":
				if (historyIdx != 0) {
					tty.removeChild(inputDiv);
					historyIdx -= 1;
					createNewInputString(login + "@" + server_name + ":" + space_expr, inputHistory[historyIdx]);

					console.log("new history index: ", historyIdx);
				}

				break;
			case "ArrowDown":
				if (historyIdx != inputHistory.length) {
					tty.removeChild(inputDiv);
					historyIdx += 1;
					createNewInputString(login + "@" + server_name + ":" + space_expr, inputHistory[historyIdx]);

					console.log("new history index: ", historyIdx);
				}
				break;
			default:
				break;
		}

		console.log("key: " + key + " position: " + cursorPosition + " realLen: " + visibleStringLen);
	});

	socket.onerror = function () {
		createDiv("Aucune réponse du serveur..");

		historyIdx = inputHistory.length;
		createNewInputString("error");
	}

	const sequence_enum = {
		"auth_login": 0,
		"auth_password": 1,
		"running": 2,
	}
	var sequence = sequence_enum.auth_login;


	/*
	receive all messages


	 */
	socket.onmessage = function (res) {
		data = JSON.parse(res.data);

		console.log(data);

		switch (sequence) {
			case sequence_enum.auth_password:
				if (data.auth == 1) {
					sequence = sequence_enum.running;
					createDiv("<br>");
					createDiv("Welcome to " + server_name + " Mr " + login);
					createDiv("<br>");
					createNewInputString(login + "@" + server_name + ":" + space_expr);
				} else {
					sequence = sequence_enum.auth_login;
					createDiv("<br>");
					createNewInputString(server_name + space_expr + "login:" + space_expr);
				}
				break;
			case sequence_enum.running:
				createDiv(data.string);

				historyIdx = inputHistory.length;
				createNewInputString(login + "@" + server_name + ":" + space_expr);
				break;
			default:
				console.warn("Unknown sequence");
				break;
		}
	};

	var login;
	var server_name = "hacking_game";

	var process = function (outStr) {
		var outStrPostProcessed = outStr.replace(space_regex, " ");

		switch (sequence) {
			case sequence_enum.auth_login:
				login = outStrPostProcessed;
				sequence = sequence_enum.auth_password;
				createNewInputString("Password:" + space_expr);
				break;
			case sequence_enum.auth_password:
				socket.send(JSON.stringify({"login": login, "password": outStrPostProcessed}));
				break;
			case sequence_enum.running:
				if (outStrPostProcessed.trim().length == 0) {
					historyIdx = inputHistory.length;
					createNewInputString(systemInputMsg);
					return;
				}

				if (inputHistory.length == 0 ||
					inputHistory[inputHistory.length - 1] != outStr)
					inputHistory.push(outStr);

				socket.send(JSON.stringify({"command": outStrPostProcessed}));
				break;
			default:
				console.warn("Unknown sequence");
				break;
		}
	}

	createDiv("Enter login root and password root<br><br>");

	/*
	 * Calculate from font-size 20px.
	 * DIV width must be multiple of 12
	 */
	var cursor = document.createElement('canvas');
	cursor.id = "cursor"

	historyIdx = 0;
	createNewInputString(server_name + "&nbsp;login:" + space_expr);

	cursor.getContext('2d');
	document.body.appendChild(cursor);
}