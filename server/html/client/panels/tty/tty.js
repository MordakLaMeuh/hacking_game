'use strict';

var TTY = function(keyboard, cursor, socket) {
	var tty = document.getElementById("js_tty");
	tty.innerHTML = "";

	var divTest = document.createElement("div");
	tty.appendChild(divTest);
	var innerTest = document.createElement("X");
	innerTest.innerHTML = "b";
	divTest.appendChild(innerTest);
	var CHAR_HEIGHT = divTest.offsetHeight;
	var CHAR_WIDTH = innerTest.offsetWidth;
	console.info("height: " + CHAR_HEIGHT + " width: " + CHAR_WIDTH);
	tty.removeChild(tty.firstChild);

	/*
	 * Active mouse scroll on PC
	 */
	tty.addEventListener(mousewheelevt, function (e) {
		e = window.event || e; // old IE support
		let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		tty.scrollTop -= delta * 20;
		putCursor(cursorPosition);
	}, false);

	/*
	 * Passive scroll on mobile
	 */
	if (IS_MOBILE == true) {
		tty.addEventListener('scroll', function(e) {
			putCursor(cursorPosition);
		}, false);
	}

	this.key_cb = function(val)
	{
		if (val == true)
			keyboard.open(updateCharString);
		else
			keyboard.close();
		console.info("key_cb");
	}

	const nbsp_space_expr = "&nbsp;";
	const common_space_regex = / /g;

	var inputHistory = new Array();
	var historyIdx;

	var inputString;
	var inputDiv;
	var cursorPosition;
	var systemInputMsg;

	var isChrome = !!window.chrome && !!window.chrome.webstore;

	var LETTERSIZE = CHAR_WIDTH;
	var NBLETTERPERLINE = 0;

	/*
	 * Indicate if setLetterField calculus was good (sometimes it make mistakes after resize)
	 */
	var tty_broken = false;

	function setLetterField()
	{
		/*
		 * Simulation of caracter insersion until a new line is required
		 */
		tty_broken = true;

		let divTest = document.createElement("div");
		tty.appendChild(divTest);
		divTest.innerHTML = "x";
		NBLETTERPERLINE = 0;
		let originalHeight = divTest.offsetHeight;
		if (originalHeight == 0 || originalHeight === undefined) {
			console.warn("Cannot measure offsetHeight");
			tty.removeChild(tty.lastChild);
			return;
		}
		while (divTest.offsetHeight == originalHeight) {
			divTest.innerHTML += "x";
			NBLETTERPERLINE += 1;
		}
		tty.removeChild(tty.lastChild);

		console.info("nb letter per line: ", NBLETTERPERLINE);

		tty_broken = false;
	}
	setLetterField();

	/*
	 * current directory, utilized by prompt
	 */
	var directory;

	function putCursor(position) {
		let div_origin_y = inputDiv.getBoundingClientRect().top;
		let div_origin_x = inputDiv.offsetLeft;
		let div_width = inputDiv.offsetWidth;

		/*
		 * Mitigation with innerHeight
		 */
		div_origin_y += tty.scrollHeight - tty.clientHeight - tty.scrollTop;

		let x_pixel = position % NBLETTERPERLINE * LETTERSIZE;
		let y_pixel = Math.trunc(position / NBLETTERPERLINE) * CHAR_HEIGHT;

		cursor.setCursorPosition(div_origin_x + x_pixel, div_origin_y + y_pixel);

		if (IS_MOBILE) {
			let offset = tty.getBoundingClientRect().bottom - div_origin_y + y_pixel;
			if (offset < 0) {
				cursor.activeCursor(false);
			} else {
				cursor.setCursorDim(CHAR_WIDTH, (offset < CHAR_HEIGHT) ? offset : CHAR_HEIGHT);
				cursor.activeCursor(true);
			}
		}
	}

	function createNewInputString(prompt, optionalStr) {
		systemInputMsg = prompt;
		inputString = systemInputMsg;
		if (optionalStr)
			inputString += optionalStr;
		cursorPosition = inputString.length;
		inputDiv = document.createElement('div');

		if ((inputString.length % NBLETTERPERLINE == 0) &&
			(cursorPosition % NBLETTERPERLINE == 0) &&
			inputString.length == cursorPosition) {
			let tmp = inputString + " ";
			inputDiv.innerHTML = tmp.replace(common_space_regex, nbsp_space_expr);
		} else {
			inputDiv.innerHTML = inputString.replace(common_space_regex, nbsp_space_expr);
		}
		tty.appendChild(inputDiv);

		tty.scrollTop += tty.scrollHeight;

		putCursor(cursorPosition);
	}

	this.write = function(str)
	{
		createNewInputString(str);
	}

	function createDiv(content) {
		let outputDiv = document.createElement('div');
		outputDiv.innerHTML = content;

		tty.appendChild(outputDiv);
		tty.scrollTop += tty.scrollHeight;
	}

	function refreshInput(inputDiv, optionalStr) {
		tty.removeChild(inputDiv);
		if (optionalStr) {
			let tmp = inputString + optionalStr;
			inputDiv.innerHTML = tmp.replace(common_space_regex, nbsp_space_expr);
		} else {
			inputDiv.innerHTML = inputString.replace(common_space_regex, nbsp_space_expr);
		}
		tty.appendChild(inputDiv);

		tty.scrollTop += tty.scrollHeight;
	}

	function removeCharacters(str, char_pos, len) {
		let part1 = str.substring(0, char_pos);
		let part2 = str.substring(char_pos + len, str.length);
		return part1 + part2;
	}

	function updateCharString(key) {
		/*
		 * Retry calcul if ttty dimension acquisition is broked
		 */
		if (tty_broken == true) {
			setLetterField();
			putCursor(cursorPosition);
		}

		if (key.length == 1) {
			let part1 = inputString.substring(0, cursorPosition);
			let part2 = inputString.substring(cursorPosition, inputString.length);

			cursorPosition += 1;
			inputString = part1 + key + part2;

			if ((inputString.length % NBLETTERPERLINE == 0) &&
					(cursorPosition % NBLETTERPERLINE == 0) &&
					inputString.length == cursorPosition)
					refreshInput(inputDiv, " ");
				else
					refreshInput(inputDiv);

			putCursor(cursorPosition);

			historyIdx = inputHistory.length;
		}

		switch (key) {
			case "Backspace":
				if (cursorPosition != systemInputMsg.length) {
					cursorPosition -= 1;

					inputString = removeCharacters(inputString, cursorPosition, 1);

					if ((inputString.length % NBLETTERPERLINE == 0) &&
						(cursorPosition % NBLETTERPERLINE == 0) &&
						inputString.length == cursorPosition)
						refreshInput(inputDiv, " ");
					else
						refreshInput(inputDiv);

					putCursor(cursorPosition);

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
					cursorPosition += 1;

					putCursor(cursorPosition);

					historyIdx = inputHistory.length;
				}
				break;
			case "ArrowLeft":
				if (cursorPosition != systemInputMsg.length) {
					cursorPosition -= 1;

					putCursor(cursorPosition);

					historyIdx = inputHistory.length;
				}
				break;
			case "ArrowUp":
				if (sequence != sequence_enum.running)
					break;
				if (historyIdx != 0) {
					tty.removeChild(inputDiv);
					historyIdx -= 1;
					createNewInputString(login + "@" + server_name + ":" + directory + "# ", inputHistory[historyIdx]);
				}

				break;
			case "ArrowDown":
				if (sequence != sequence_enum.running)
					break;
				if (historyIdx != inputHistory.length) {
					tty.removeChild(inputDiv);
					historyIdx += 1;
					createNewInputString(login + "@" + server_name + ":" + directory + "# ", inputHistory[historyIdx]);
				}
				break;
			default:
				break;
		}
	};

	const sequence_enum = {
		"auth_login": 0,
		"auth_password": 1,
		"running": 2,
		"auth_login_ssh": 3,
		"auth_password_ssh": 4
	}
	var sequence = sequence_enum.auth_login;

	function onmessage(data) {
		if (data.directory)
			directory = data.directory;
		if (data.login)
			login = data.login;
		if (data.server)
			server_name = data.server;
		switch (sequence) {
			case sequence_enum.auth_password:
				if (data.auth == 1) {
					sequence = sequence_enum.running;
					createDiv("<br>");
					createDiv("Welcome to " + server_name + " Mr " + login);
					createDiv("<br>");
					createNewInputString(login + "@" + server_name + ":" + directory + "# ");
				} else {
					sequence = sequence_enum.auth_login;
					createDiv("<br>");
					createNewInputString("Login: ");
				}
				break;
			case sequence_enum.running:
				if (data.auth_ssh == 1) {
					sequence = sequence_enum.auth_login_ssh;
					createNewInputString("SSH login: ");
					break;
				}
				if (data.string)
					createDiv(data.string);

				historyIdx = inputHistory.length;
				createNewInputString(login + "@" + server_name + ":" + directory + "# ");
				break;
			default:
				console.warn("Unknown sequence");
				break;
		}
		}

	var login;
	var server_name = "";
	var ssh_login;

	function process(outStr) {
		switch (sequence) {
			case sequence_enum.auth_login:
				login = outStr;
				sequence = sequence_enum.auth_password;
				createNewInputString("Password: ");
				break;
			case sequence_enum.auth_password:
				socket.send(JSON.stringify({"login": login, "password": outStr}));
				break;
			case sequence_enum.running:
				if (outStr.trim().length == 0) {
					historyIdx = inputHistory.length;
					createNewInputString(systemInputMsg);
					return;
				}

				if (inputHistory.length == 0 ||
					inputHistory[inputHistory.length - 1] != outStr)
					inputHistory.push(outStr);

				socket.send(JSON.stringify({"command": outStr}));
				break;
			case sequence_enum.auth_login_ssh:
				ssh_login = outStr;
				sequence = sequence_enum.auth_password_ssh;
				createNewInputString("Password: ");
				break;
			case sequence_enum.auth_password_ssh:
				socket.send(JSON.stringify({"login":ssh_login, "password":outStr}));
				sequence = sequence_enum.running;
				break;
			default:
				console.warn("Unknown sequence");
				break;
		}
	}

	/*
	 * Calculate from font-size 20px.
	 * DIV width must be multiple of 12
	 */
	cursor.setCursorDim(CHAR_WIDTH, CHAR_HEIGHT);

	this.display = function(actif) {
			if (actif == true) {
				putCursor(cursorPosition);
				cursor.activeCursor(true);
			} else {
				cursor.activeCursor(false);
			}
	}

	historyIdx = 0;
	createNewInputString("login: ");

	if(IS_MOBILE == true) {
		console.info("Mobile TTY");

		let isKeyboardActive = false;

		this.setActive = function() {
		}

		/*
		 * Triggered when lefting tty
		 */
		this.setInactive = function() {
			tty.style.height =  "calc(var(--vh, 1vh) * " + 90 + ")";
			tty.scrollTop += tty.scrollHeight;
			keyboard.close();
			isKeyboardActive = false;
		}

		tty.addEventListener("mousedown", function(e){
			if (isKeyboardActive == true) {
				tty.style.height =  "calc(var(--vh, 1vh) * " + 90 + ")";
				tty.scrollTop += tty.scrollHeight;
				keyboard.close();
				isKeyboardActive = false;
				return;
			}
			tty.style.height =  "calc(var(--vh, 1vh) * " + 50 + ")";
			tty.scrollTop += tty.scrollHeight;
			keyboard.open(updateCharString);
			isKeyboardActive = true;
		}, false);
	} else {
		console.info("Browser TTY");
		cursor.activeCursor(true);

		keyboard.open(updateCharString);
	}

	window.addEventListener("resize", function() {
		console.warn("resize");
		tty.scrollTop += tty.scrollHeight;
		setLetterField();
		putCursor(cursorPosition);
	});

	socket.register(["tty"], onmessage);
}
