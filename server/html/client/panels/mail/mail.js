'use strict';

var MAIL = function(keyboard, cursor, tty_key_cb)
{
	var self = this;

	this.mailObj;
	var onFolder = false;

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

			loginBtn.addEventListener("mousedown", function(){
				sendLoginData(document.getElementById("loginInput").value, document.getElementById("passwordInput").value);
			});

			loginForm.addEventListener("keyup", function(event) {
				event.preventDefault();
				if (event.key === "Enter") {
					sendLoginData(document.getElementById("loginInput").value, document.getElementById("passwordInput").value);
				}});
		}());

		/*
		 * Disable key registering on tty when filling input field
		 */
		document.getElementById("loginInput").addEventListener("focus", function() {
			tty_key_cb(0);
		}, true);
		document.getElementById("loginInput").addEventListener("blur", function() {
			tty_key_cb(1);
		}, true);

		document.getElementById("passwordInput").addEventListener("focus", function() {
			tty_key_cb(0);
		}, true);
		document.getElementById("passwordInput").addEventListener("blur", function() {
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
			reduceScreen();
			input_login.focus(e.clientX, e.clientY);
			keyboard.open(input_login.write);
			e.stopPropagation();
		}, false);

		/*
		 * Password field handler
		 */
		passwordInput.addEventListener("mousedown", function(e){
			reduceScreen();
			input_password.focus(e.clientX, e.clientY);
			keyboard.open(input_password.write);
			e.stopPropagation();
		}, false);

		/*
		 * Enter button handler
		 */
		loginBtn.addEventListener("mousedown", function(e){
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
			displayFolder();
		});
		signOutBtn.addEventListener("mousedown", function(){
			signOut()
		});
	}());

	/*
	 * Check mail data received from server to allow or deny login
	 */
	this.login = function(mail) {
		if (mail.content) {
			this.mailObj = mail;
			let mailName = document.getElementById("mailName");
			if (mail.name == "root")
				mailName.innerHTML = "Your Mail";
			else
				mailName.innerHTML = mail.name;

			displayLoginForm(false);
			displayMailHeaderAndBody(true);
			displayFolder(mail);
		} else {
			displayErrorForm(true);
		}
	}

	/*
	 * Display clicked email folder by displaying all the mails of the folder
	 */
	function displayFolder(mail) {
		if (onFolder == false) {
			onFolder = true;
			let mailMessagesDiv = document.getElementById("mail_messages");
			changeMailHeader(onFolder, null, null, null);
			removeMailList(mailMessagesDiv);
			displayMailList(self.mailObj, mailMessagesDiv);
		}
	}

	/*
	 * Display all the mail of a folder
	 */
	function displayMailList(mail, mailMessagesDiv) {
		for (let i = 0; i < mail.content.length; i++) {
			function func(i) {
				let mailDivContainer = document.createElement("div");

				let senderP = document.createElement("p");
				let receiverP = document.createElement("p");
				let titleP = document.createElement("p");

				senderP.className = "from";
				receiverP.className = "to";
				titleP.className = "title";

				if (mail.content[i].sender == 1) {
					senderP.innerHTML = "From : " + mail.name;
					receiverP.innerHTML = "To : " + mail.content[i].from_to;
				} else {
					senderP.innerHTML = "From : " + mail.content[i].from_to;
					receiverP.innerHTML = "To : " + mail.name;
				}
				titleP.innerHTML = mail.content[i].title;

				mailDivContainer.appendChild(senderP);
				mailDivContainer.appendChild(receiverP);
				mailDivContainer.appendChild(titleP);

				mailMessagesDiv.appendChild(mailDivContainer);

				if (!mail.content[i].read) {
					mailDivContainer.style.fontWeight = "bold";
					mailDivContainer.style.backgroundColor = "rgba(120, 200, 255, 0.2)";
				}

				mailDivContainer.addEventListener("mousedown", function(){
					displayMailContent(mailMessagesDiv, mail, i);
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
	function displayMailContent(mailList, mail, index) {
		onFolder = false;
		mail.content[index].read = true;
		removeMailList(mailList);

		let mailContent = document.createElement("p");

		if (mail.content[index].sender == 1) {
			changeMailHeader(onFolder, mail.name, mail.content[index].from_to, mail.content[index].title);
		} else {
			changeMailHeader(onFolder, mail.content[index].from_to, mail.name, mail.content[index].title);
		}
		mailContent.innerHTML = mail.content[index].text;

		mailList.appendChild(mailContent);
		let obj = new Object();
		obj.name = mail.name;
		obj.index = index;
		socket.send(JSON.stringify({"mail": obj}));
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
		onFolder = false;
		displayMailHeaderAndBody(false);
		displayErrorForm(false);
		displayLoginForm(true);
	}

	/*
	 * Send login data to server
	 */
	function sendLoginData(name, password) {
		let obj = new Object();
		obj.name = name;
		obj.password = password;
		console.log(obj);
		socket.send(JSON.stringify({"mail": obj}));
	}
}
