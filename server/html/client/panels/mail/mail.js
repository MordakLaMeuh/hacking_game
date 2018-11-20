'use strict';

var MAIL = function(notif_button_cb, keyboard, cursor, tty_key_cb, socket)
{
	var self = this;
	var volontaryLogin = false;			// true when a explicit identification process were triggered

	var currentSession = new Object();	// information about current opened session
	currentSession.login = "";
	currentSession.mail = new Array();
	currentSession.onFolder = false;

	if (IS_MOBILE == false) {
		/*
		 * OLD Browser code is on below
		 */
		login_form_mail.innerHTML += `<form id='loginForm'>
		<p id='errorForm'>Invalid login or password</p>
		<div class='input-container'>
		<input id= 'loginInput' class='input-field' type='text' placeholder='Login' spellcheck='false' autocapitalize='none' autocomplete='off' autocorrect='off' />
		</div>
		<div class='input-container'>
		<input id='passwordInput' class='input-field' type='text' placeholder='Password' spellcheck='false' autocapitalize='none' autocomplete='off' autocorrect='off' />
		</div>
		<button id='loginBtn' class='btn' type='button'>Login</button>
		</form>`;

		/*
		 * Self invoked function to add listener
		 */
		(function()
		{
			let loginBtn = document.getElementById("loginBtn");
			let loginForm = document.getElementById("loginForm");
			let mailMessagesDiv = document.getElementById("mail_messages");

			loginBtn.addEventListener("mousedown", function(){
				notif_button_cb("mail", false, true);
				sendLoginData(document.getElementById("loginInput").value, document.getElementById("passwordInput").value);
			});

			loginForm.addEventListener("keyup", function(event) {
				notif_button_cb("mail", false, true);
				event.preventDefault();
				if (event.key === "Enter") {
					sendLoginData(document.getElementById("loginInput").value, document.getElementById("passwordInput").value);
				}});

			/*
			 * Active mouse scroll on PC
			 */
			mailMessagesDiv.addEventListener(mousewheelevt, function (e) {
				notif_button_cb("mail", false, true);
				e = window.event || e; // old IE support
				let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				mailMessagesDiv.scrollTop -= delta * 20;
			}, false);
		}());

		/*
		 * Disable key registering on tty when filling input field
		 */
		document.getElementById("loginInput").addEventListener("focus", function() {
			notif_button_cb("mail", false, true);
			tty_key_cb(0);
		}, true);
		document.getElementById("loginInput").addEventListener("blur", function() {
			notif_button_cb("mail", false, true);
			tty_key_cb(1);
		}, true);

		document.getElementById("passwordInput").addEventListener("focus", function() {
			notif_button_cb("mail", false, true);
			tty_key_cb(0);
		}, true);
		document.getElementById("passwordInput").addEventListener("blur", function() {
			notif_button_cb("mail", false, true);
			tty_key_cb(1);
		}, true);
	} else {
		/*
		 * MOBILE custom_input code is on below
		 */
		login_form_mail.innerHTML +=
			`<form id="loginForm">
			 <div id="loginInput" class="custom_input_text input-field"></div>
			 <div id="passwordInput" class="custom_input_text input-field"></div>
			 <button id='loginBtn' class='btn' type='button'>Login</button>
			 <p id='errorForm'>Invalid login or password</p>
			 </form>`;

		let loginBtn = document.getElementById("loginBtn");

		function closeKeyboard() {
			panels.style.height = "calc(var(--vh, 1vh) * 90)";
			mail.style.height = "calc(var(--vh, 1vh) * 90)";
			keyboard.close();
			cursor.activeCursor(false);
		}

		/*
		 * Custom input action button and enter
		 */
		function action(self, str) {
			console.info("validation custom_input mail");
			closeKeyboard();
			if (input_login.getContent().trim().length != 0 && input_password.getContent().trim().length != 0) {
				sendLoginData(input_login.getContent(), input_password.getContent());
				input_login.fflushContent();
				input_password.fflushContent();
				input_login.resetInitialization();
				input_password.resetInitialization();
			}
		}

		let input_login = new CUSTOM_INPUT(loginInput, action, cursor, "Login");
		let input_password = new CUSTOM_INPUT(passwordInput, action, cursor, "Password");

		/*
		 * When switching to mail panel login screen
		 */
		this.setActive = function() {
			input_login.calibrate();
			input_password.calibrate();
		}

		/*
		 * When lefting mail panel
		 */
		this.setInactive = function() {
			closeKeyboard();
		}

		/*
		 * Default area handler
		 */
		mail.addEventListener("mousedown", function(e) {
			notif_button_cb("mail", false, true);
			closeKeyboard();
		}, false);

		function reduceScreen() {
			panels.style.height = "calc(var(--vh, 1vh) * 50)";
			mail.style.height = "calc(var(--vh, 1vh) * 50)";
		}
		/*
		 * Login field handler
		 */
		loginInput.addEventListener("mousedown", function(e){
			notif_button_cb("mail", false, true);
			reduceScreen();
			input_login.focus(e.clientX, e.clientY);
			keyboard.open(input_login.write);
			e.stopPropagation();
		}, false);

		/*
		 * Password field handler
		 */
		passwordInput.addEventListener("mousedown", function(e){
			notif_button_cb("mail", false, true);
			reduceScreen();
			input_password.focus(e.clientX, e.clientY);
			keyboard.open(input_password.write);
			e.stopPropagation();
		}, false);

		/*
		 * Enter button handler
		 */
		loginBtn.addEventListener("mousedown", function(e){
			notif_button_cb("mail", false, true);
			action(null, null);
			e.stopPropagation();
		}, false);
	}
	/*
	 * Self invoked function to add listener
	 */
	(function()
	{
		let signOutBtn = document.getElementById("signOutBtn");
		let backBtn = document.getElementById("backBtn");

		backBtn.addEventListener("mousedown", function(){
			notif_button_cb("mail", false, true);
			displayFolder();
		});
		signOutBtn.addEventListener("mousedown", function(){
			notif_button_cb("mail", false, true);
			signOut()
		});
	}());

	/*
	 * Check mail data received from server to allow or deny login
	 */
	function login(mail) {
		if (mail.content) {
			/*
			 * Test if it is an update and if the mail concerned the current session
			 */
			if (mail.update == true) {
				if (currentSession.login == mail.name) {
					mail.content.forEach(function(email) {
						currentSession.mail.push(email);
					});
					/*
					 * Dislay new mails if on folder
					 */
					if (currentSession.onFolder == true)
						displayFolder();

					notif_button_cb("mail", true, true);
				} else {
					/*
					 * we are not concern by this mail updating
					 */
				}
				return;
			}

			/*
			 * Check if session was volontary launched
			 */
			if (volontaryLogin == false) {
				/*
				 * Check if we are already logged
				 */
				if (currentSession.login != "")  {
					return ;	// Don't do anything
				}
				/*
				 * In case of new unvolontary identification
				 */
				notif_button_cb("mail", true, true);
			}

			currentSession.onFolder = true;

			/*
			 * Create all old DOM structures is in logged state
			 */
			currentSession.login = mail.name;
			let mailName = document.getElementById("mailName");
			if (currentSession.login == "root")
				mailName.innerHTML = "Your Mail";
			else
				mailName.innerHTML = currentSession.login;

			displayLoginForm(false);
			displayMailHeaderAndBody(true);

			mail.content.forEach(function(email) {
				currentSession.mail.push(email);
			});

			displayFolder();
		} else {
			displayErrorForm(true);
		}
		volontaryLogin = false;
	}

	/*
	 * Display clicked email folder by displaying all the mails of the folder
	 */
	function displayFolder() {
		let mailMessagesDiv = document.getElementById("mail_messages");
		changeMailHeader(true, null, null, null);
		removeMailList(mailMessagesDiv);
		displayMailList(mailMessagesDiv);
	}

	/*
	 * Display all the mail of a folder
	 */
	function displayMailList(mailMessagesDiv) {
		for (let i = 0; i < currentSession.mail.length; i++) {
			function func(i) {
				let mailDivContainer = document.createElement("div");

				let senderP = document.createElement("p");
				let receiverP = document.createElement("p");
				let titleP = document.createElement("p");

				senderP.className = "from";
				receiverP.className = "to";
				titleP.className = "title";

				if (currentSession.mail[i].sender == 1) {
					senderP.innerHTML = "From : " + currentSession.login;
					receiverP.innerHTML = "To : " + currentSession.mail[i].from_to;
				} else {
					senderP.innerHTML = "From : " + currentSession.mail[i].from_to;
					receiverP.innerHTML = "To : " + currentSession.login;
				}
				titleP.innerHTML = currentSession.mail[i].title;

				mailDivContainer.appendChild(senderP);
				mailDivContainer.appendChild(receiverP);
				mailDivContainer.appendChild(titleP);

				mailMessagesDiv.appendChild(mailDivContainer);

				if (!currentSession.mail[i].read) {
					mailDivContainer.style.fontWeight = "bold";
					mailDivContainer.style.backgroundColor = "rgba(120, 200, 255, 0.2)";
				}

				mailDivContainer.addEventListener("mousedown", function(){
					notif_button_cb("mail", false, true);
					displayMailContent(mailMessagesDiv, i);
				});
			};
			func(i);
		}
	}

	/*
	 * Remove all the mails of a folder
	 */
	function removeMailList(mailList) {
		while (mailList.firstChild) {
			mailList.removeChild(mailList.firstChild);
		}
	}

	/*
	 * Change mail header to fit to the current display (mail list or mail content)
	 */
	function changeMailHeader(onFolder, fromContent, toContent, titleContent) {
		let mailInfoBarDiv = document.getElementById("mail_info_bar");

		let backBtn = document.getElementById("backBtn");

		if (onFolder)
		{
			let exchangeInfoDiv = document.getElementById("exchangeInfo");
			while (mailInfoBarDiv.children.length > 1) {
				mailInfoBarDiv.removeChild(mailInfoBarDiv.lastChild);
			}
			while (exchangeInfoDiv.firstChild)
			{
				exchangeInfoDiv.removeChild(exchangeInfoDiv.firstChild);
			}
			mailInfoBarDiv.style.display = "none";
			backBtn.style.display = "none";
		}
		else
		{
			mailInfoBarDiv.style.display = "";

			let exchangeInfoDiv = document.getElementById("exchangeInfo")
			let from = document.createElement("p");
			let to = document.createElement("p");
			let title = document.createElement("p");

			from.innerHTML = "From: " + fromContent;
			to.innerHTML = "To: " +  toContent;
			title.innerHTML = titleContent;

			exchangeInfoDiv.appendChild(from);
			exchangeInfoDiv.appendChild(to);
			mailInfoBarDiv.appendChild(exchangeInfoDiv);
			mailInfoBarDiv.appendChild(title);
			backBtn.style.display = "flex";
		}
	}

	/*
	 * Display content of the clicked mail
	 */
	function displayMailContent(mailList, index) {
		currentSession.onFolder = false;
		// currentSession.mail[index].read = true;
		removeMailList(mailList);

		let mailContent = document.createElement("p");

		if (currentSession.mail[index].sender == 1) {
			changeMailHeader(
				currentSession.onFolder,
				currentSession.login,
				currentSession.mail[index].from_to,
				currentSession.mail[index].title);
		} else {
			changeMailHeader(
				currentSession.onFolder,
				currentSession.mail[index].from_to,
				currentSession.login,
				currentSession.mail[index].title);
		}
		mailContent.innerHTML = currentSession.mail[index].text;

		mailList.appendChild(mailContent);
		let obj = new Object();
		obj.name = currentSession.login;
		obj.index = index;
		socket.send({"mail": obj});
	}

	/*
	 * Display or hide mail_header and mail_body
	 */
	function displayMailHeaderAndBody(display) {
		let mailHeaderDiv = document.getElementById("mail_header");
		let mailBodyDiv = document.getElementById("mail_body");
		if (display == false) {
			mailHeaderDiv.style.display = "none";
			mailBodyDiv.style.display = "none";
		} else {
			mailHeaderDiv.style.display = "flex";
			mailBodyDiv.style.display = "flex";
		}
	}

	/*
	 * Display or hide error login message
	 */
	function displayErrorForm(display) {
		let errorForm = document.getElementById("errorForm");
		if (display == false)
			errorForm.style.display = "none";
		else
			errorForm.style.display = "flex";
	}

	/*
	 * Display or hide login form
	 */
	function displayLoginForm(display) {
		let loginForm = document.getElementById("loginForm");
		if (display == true) {
			loginForm.style.display = "block";
			/*
			 * After switching to login area, calibrate custom input fields
			 */
			if (IS_MOBILE) {
				self.setActive();
			}
		} else {
			loginForm.style.display = "none";
		}
	}

	/*
	 * Sign out from mail and display login form
	 */
	function signOut() {
		currentSession.onFolder = false;

		displayMailHeaderAndBody(false);
		displayErrorForm(false);
		displayLoginForm(true);

		currentSession.login = "";
		currentSession.mail = new Array();
	}

	/*
	 * Send login data to server
	 */
	function sendLoginData(name, password) {
		let obj = new Object();
		obj.name = name;
		obj.password = password;
		console.log(obj);
		volontaryLogin = true;

		socket.send({"mail": obj});
	}

	socket.register(["mail"], login);
}
