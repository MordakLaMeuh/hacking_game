'use strict';

var MAIL = function()
{
	var self = this;
	this.mailObj;
	var onFolder = false;

	/*
	 * Self invoked function to add listener
	 */
	(function()
	{
		var signInBtn = document.getElementById("signInBtn");
		var loginBtn = document.getElementById("loginBtn");
		var backBtn = document.getElementById("backBtn");

		signInBtn.addEventListener("mousedown", function(){
			self.signOut()
		});
		loginBtn.addEventListener("mousedown", function(){
			self.sendLoginData();
		});
		backBtn.addEventListener("mousedown", function(){
			self.displayFolder()});
	}());

	/*
	 * Display clicked email folder by displaying all the mails of the folder
	 */
	this.displayFolder = function(mail)
	{
		if (!onFolder)
		{
			onFolder = true;
			var mailMessagesUl = document.getElementById("mail_messages");
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
		for (var i = 0; i < mail.content.length; i++)
		{
			var func = function(i)
			{
				var mailLiContainer = document.createElement("li");
				var mailUlContainer = document.createElement("ul");

				var senderLi = document.createElement("li");
				var receiverLi = document.createElement("li");
				var titleLi = document.createElement("li");

				senderLi.className = "from";
				receiverLi.className = "to";
				titleLi.className = "title";

				senderLi.innerHTML = mail.content[i].from_to;
				receiverLi.innerHTML = mail.name;
				titleLi.innerHTML = mail.content[i].title;

				mailUlContainer.appendChild(senderLi);
				mailUlContainer.appendChild(receiverLi);
				mailUlContainer.appendChild(titleLi);

				mailLiContainer.appendChild(mailUlContainer);
				mailMessagesUl.appendChild(mailLiContainer);

				if (!mail.content[i].read)
				{
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
		while (mailList.firstChild)
		{
			mailList.removeChild(mailList.firstChild);
		}
	}

	/*
	 * Change mail header to fit to the current display (mail list or mail content)
	 */
	this.changeMailHeader = function(onFolder)
	{
		var mailInfoBarUl = document.getElementById("mail_info_bar");

		for (var i = 0; i < mailInfoBarUl.children.length; i++)
		{
			if (!onFolder)
				mailInfoBarUl.children[i].style.display = "none";
			else
			{
				if (i < 3)
					mailInfoBarUl.children[i].style.display = "flex";
				else
				{
					mailInfoBarUl.removeChild(mailInfoBarUl.children[i]);
					i--;
				}
			}
		}
		var backBtn = document.getElementById("backBtn");
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
		var mailInfoBarUl = document.getElementById("mail_info_bar");
		this.changeMailHeader(onFolder);
		var from = document.createElement("li");
		var to = document.createElement("li");
		var title = document.createElement("li");
		var mailContent = document.createElement("p");

		from.innerHTML = "From: " + mail.content[index].from_to;
		to.innerHTML = "To: " + mail.name;
		title.innerHTML = mail.content[index].title;
		mailContent.innerHTML = mail.content[index].text;

		mailInfoBarUl.appendChild(from);
		mailInfoBarUl.appendChild(to);
		mailInfoBarUl.appendChild(title);
		mailList.appendChild(mailContent);

		var obj = new Object();
		obj.name = mail.name;
		obj.index = index;
		socket.send(JSON.stringify({"mail": obj}));
	}

	/*
	 * Display or hide mail_header and mail_body
	 */
	this.displayMailHeaderAndBody = function(display)
	{
		var mailHeaderDiv = document.getElementById("mail_header");
		var mailBodyDiv = document.getElementById("mail_body");
		if (!display)
		{
			mailHeaderDiv.style.display = "none";
			mailBodyDiv.style.display = "none";
		}
		else
		{
			mailHeaderDiv.style.display = "flex";
			mailBodyDiv.style.display = "flex";
		}
	}

	/*
	 * Display or hide error login message
	 */
	this.displayErrorForm = function(display)
	{
		var errorForm = document.getElementById("errorForm");
		if (!display)
			errorForm.style.display = "none";
		else
			errorForm.style.display = "flex";
	}

	/*
	 * Display or hide login form
	 */
	this.displayLoginForm = function(display)
	{
		var loginForm = document.getElementById("loginForm");
		if (display)
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
		var obj = new Object();
		obj.name = document.getElementById("loginInput").value;;
		obj.password = document.getElementById("passwordInput").value;;
		socket.send(JSON.stringify({"mail": obj}));
		console.log("On envoie");
	}

	/*
	 * Check mail data received from server to allow or deny login
	 */
	this.login = function(mail)
	{
		if (mail.content)
		{
			this.mailObj = mail;
			var mailName = document.getElementById("mailName");
			if (mail.name == "root")
				mailName.innerHTML = "Your Mail";
			else
				mailName.innerHTML = mail.name + "\'s Mail";

			this.displayLoginForm(false);
			this.displayMailHeaderAndBody(true);
			this.displayFolder(mail);
		}
		else
			this.displayErrorForm(true);
	}
}
