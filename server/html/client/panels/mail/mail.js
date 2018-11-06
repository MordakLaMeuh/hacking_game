'use strict';

var MAIL = function(tty_key_cb)
{
	var self = this;

	this.mailObj;
	var onFolder = false;

	/*
	 * Self invoked function to add listener
	 */
	(function()
	{
		let signInBtn = document.getElementById("signInBtn");
		let loginBtn = document.getElementById("loginBtn");
		let backBtn = document.getElementById("backBtn");
		let loginForm = document.getElementById("loginForm");


		signInBtn.addEventListener("mousedown", function(){
			self.signOut()
		});
		loginBtn.addEventListener("mousedown", function(){
			self.sendLoginData();
		});

		loginForm.addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.key === "Enter") {
				self.sendLoginData();
			}});

		backBtn.addEventListener("mousedown", function(){
			self.displayFolder()});
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

	/*
	 * Display clicked email folder by displaying all the mails of the folder
	 */
	this.displayFolder = function(mail)
	{
		if (onFolder == false)
		{
			onFolder = true;
			let mailMessagesUl = document.getElementById("mail_messages");
			console.log("on efface");
			this.changeMailHeader(onFolder);
			this.removeMailList(mailMessagesUl);
			this.displayMailList(this.mailObj, mailMessagesUl);
		}
	}

	/*
	 * Display all the mail of a folder
	 */
	this.displayMailList = function(mail, mailMessagesUl)
	{
		for (let i = 0; i < mail.content.length; i++)
		{
			function func(i)
			{
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
					self.displayMailContent(mailMessagesUl, mail, i);
				});
			};
			func(i);
		}
	}

	/*
	 * Remove all the mails of a folder
	 */
	this.removeMailList = function(mailList)
	{
		while (mailList.firstChild) {
			mailList.removeChild(mailList.firstChild);
		}
	}

	/*
	 * Change mail header to fit to the current display (mail list or mail content)
	 */
	this.changeMailHeader = function(onFolder)
	{
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
	this.displayMailContent = function(mailList, mail, index)
	{
		onFolder = false;
		mail.content[index].read = true;
		this.removeMailList(mailList);
		let mailInfoBarUl = document.getElementById("mail_info_bar");
		this.changeMailHeader(onFolder);
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
	this.displayMailHeaderAndBody = function(display)
	{
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
	this.displayErrorForm = function(display)
	{
		let errorForm = document.getElementById("errorForm");
		if (display == false)
			errorForm.style.display = "none";
		else
			errorForm.style.display = "flex";
	}

	/*
	 * Display or hide login form
	 */
	this.displayLoginForm = function(display)
	{
		let loginForm = document.getElementById("loginForm");
		if (display == true)
			loginForm.style.display = "block";
		else
			loginForm.style.display = "none";
	}

	/*
	 * Sign out from mail and display login form
	 */
	this.signOut = function()
	{
		onFolder = false;
		this.displayMailHeaderAndBody(false);
		this.displayErrorForm(false);
		this.displayLoginForm(true);
	}

	/*
	 * Send login data to server
	 */
	this.sendLoginData = function()
	{
		let obj = new Object();
		obj.name = document.getElementById("loginInput").value;;
		obj.password = document.getElementById("passwordInput").value;;
		socket.send(JSON.stringify({"mail": obj}));
		console.log(obj.name);
		console.log(obj.password);
		console.log("On envoie");
	}

	/*
	 * Check mail data received from server to allow or deny login
	 */
	this.login = function(mail)
	{
		if (mail.content) {
			this.mailObj = mail;
			let mailName = document.getElementById("mailName");
			if (mail.name == "root")
				mailName.innerHTML = "Your Mail";
			else
				mailName.innerHTML = mail.name;

			this.displayLoginForm(false);
			this.displayMailHeaderAndBody(true);
			this.displayFolder(mail);
		} else {
			this.displayErrorForm(true);
		}
	}
}
