'use strict';

var MAIL = function(keyboard, cursor, tty_key_cb)
{
	var self = this;

	this.mailObj;
	var onFolder = false;

	if (IS_MOBILE == false) {
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
				sendLoginData();
			});

			loginForm.addEventListener("keyup", function(event) {
				event.preventDefault();
				if (event.key === "Enter") {
					sendLoginData();
				}});
		}());

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
		login_form_mail.innerHTML +=
			`<form id="loginForm">
			 <p id='errorForm'>Invalid login or password</p>
			 <div id="loginInput" class="custom_input_text input-field"></div>
			 <div id="passwordInput" class="custom_input_text input-field"></div>
			 <button id='loginBtn' class='btn' type='button'>Login</button>
			 </form>`;

		this.setActive = function() {
		}

		this.setInactive = function() {
		}
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
			let mailMessagesUl = document.getElementById("mail_messages");
			console.log("on efface");
			changeMailHeader(onFolder);
			removeMailList(mailMessagesUl);
			displayMailList(self.mailObj, mailMessagesUl);
		}
	}

	/*
	 * Display all the mail of a folder
	 */
	function displayMailList(mail, mailMessagesUl) {
		for (let i = 0; i < mail.content.length; i++) {
			function func(i) {
				let mailLiContainer = document.createElement("li");
				let mailUlContainer = document.createElement("ul");

				let senderLi = document.createElement("li");
				let receiverLi = document.createElement("li");
				let titleLi = document.createElement("li");

				senderLi.className = "from";
				receiverLi.className = "to";
				titleLi.className = "title";

				if (mail.content[i].sender == 1) {
					senderLi.innerHTML = mail.name;
					receiverLi.innerHTML = mail.content[i].from_to;
				} else {
					senderLi.innerHTML = mail.content[i].from_to;
					receiverLi.innerHTML = mail.name;
				}
				titleLi.innerHTML = mail.content[i].title;

				mailUlContainer.appendChild(senderLi);
				mailUlContainer.appendChild(receiverLi);
				mailUlContainer.appendChild(titleLi);

				mailLiContainer.appendChild(mailUlContainer);
				mailMessagesUl.appendChild(mailLiContainer);

				if (!mail.content[i].read) {
					mailLiContainer.style.fontWeight = "bold";
					mailLiContainer.style.backgroundColor = "rgba(120, 200, 255, 0.2)";
				}

				mailLiContainer.addEventListener("mousedown", function(){
					displayMailContent(mailMessagesUl, mail, i);
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
	function changeMailHeader(onFolder) {
		let mailInfoBarUl = document.getElementById("mail_info_bar");

		for (let i = 0; i < mailInfoBarUl.children.length; i++) {
			if (!onFolder) {
				mailInfoBarUl.children[i].style.display = "none";
			} else {
				if (i < 3) {
					mailInfoBarUl.children[i].style.display = "flex";
				} else {
					mailInfoBarUl.removeChild(mailInfoBarUl.children[i]);
					i--;
				}
			}
		}
		let backBtn = document.getElementById("backBtn");
		if (!onFolder)
			backBtn.style.display = "flex";
		else
			backBtn.style.display = "none";
	}

	/*
	 * Display content of the clicked mail
	 */
	function displayMailContent(mailList, mail, index) {
		onFolder = false;
		mail.content[index].read = true;
		removeMailList(mailList);
		let mailInfoBarUl = document.getElementById("mail_info_bar");
		changeMailHeader(onFolder);
		let from = document.createElement("li");
		let to = document.createElement("li");
		let title = document.createElement("li");
		let mailContent = document.createElement("p");

		if (mail.content[index].sender == 1) {
			from.innerHTML = "From: " + mail.name;
			to.innerHTML = "To: " +  mail.content[index].from_to;
		} else {
			from.innerHTML = "From: " + mail.content[index].from_to;
			to.innerHTML = "To: " + mail.name;
		}
		title.innerHTML = mail.content[index].title;
		mailContent.innerHTML = mail.content[index].text;

		mailInfoBarUl.appendChild(from);
		mailInfoBarUl.appendChild(to);
		mailInfoBarUl.appendChild(title);
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
		console.log("loginForm");
		if (display == true)
			loginForm.style.display = "block";
		else
			loginForm.style.display = "none";
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
	function sendLoginData() {
		let obj = new Object();
		obj.name = document.getElementById("loginInput").value;;
		obj.password = document.getElementById("passwordInput").value;;
		socket.send(JSON.stringify({"mail": obj}));
		console.log(obj.name);
		console.log(obj.password);
		console.log("On envoie");
	}
}
