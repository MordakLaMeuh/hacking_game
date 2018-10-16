'use strict';

var MAIL = function()
{
	var self = this;
	this.mailObj;
	var onFolder = false;

	(function()
	{
		var leftSideUl = document.getElementById("left_side_mail");
		var signInBtn = document.getElementById("signInBtn");
		for (var i = 0; i < leftSideUl.children.length; i++)
		{
			leftSideUl.children[i].addEventListener("mousedown", function(){
				self.displayFolder()});
		}
		signInBtn.addEventListener("mousedown", function(){
			self.signOut()
		});
	}());

	this.displayFolder = function(mail)
	{
		if (!onFolder)
		{
			var mailDiv = document.getElementById("mail");
			var mailMessagesUl = document.getElementById("mail_messages");
			if (mailDiv.children.length > 3)
			{
				mailDiv.removeChild(mailDiv.lastChild);
				// this.removeSignInForm(mailDiv);
				this.displayMailHeaderAndBody(true);
			}
			else
			{
				onFolder = true;
				this.changeMailHeader(onFolder);
				this.removeMailList(mailMessagesUl);
			}
			this.displayMailList(this.mailObj, mailMessagesUl);
		}

	}

	this.displayMailList = function(mail, mailMessagesUl)
	{
		// var mailDiv = document.getElementById("mail");
		// var mailMessagesUl = document.getElementById("mail_messages");
		// if (mailDiv.children.length > 3)
		// 	this.removeSignInForm(mailDiv);
		// else
		// 	this.removeMailList(mailMessagesUl);
		// this.mailObj = mail;
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

	this.removeMailList = function(mailList)
	{
		while (mailList.firstChild)
		{
			mailList.removeChild(mailList.firstChild);
		}
	}

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
		var mailHeaderDiv = document.getElementById("mail_header");
		if (!onFolder)
		{
			var backBtn = document.createElement("input");
			backBtn.value = "Back";
			backBtn.type = "submit";
			backBtn.cursor = "pointer";
			backBtn.addEventListener("mousedown", function(){
				self.displayFolder()});
			mailHeaderDiv.insertBefore(backBtn, mailHeaderDiv.firstChild);
		}
		else
			mailHeaderDiv.removeChild(mailHeaderDiv.firstChild);
	}

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

	this.signOut = function()
	{
		this.displayMailHeaderAndBody(false);
		var mailDiv = document.getElementById("mail");
		var loginForm = document.createElement("form");
		var loginDiv = document.createElement("div");
		var passwordDiv = document.createElement("div");
		var loginInput = document.createElement("input");
		var passwordInput = document.createElement("input");
		var iLogin = document.createElement("i");
		var iPassword = document.createElement("i");
		var loginBtn = document.createElement("button");

		loginDiv.className = "input-container";
		passwordDiv.className = "input-container";

		loginInput.className = "input-field";
		passwordInput.className = "input-field";
		loginForm.className = "login-form";

		loginInput.id = "essai1";

		loginInput.type = "password";
		loginInput.placeholder = "Login";

		loginInput.spellcheck = "false";
		passwordInput.placeholder = "Password";
		passwordInput.type = "password";
		iLogin.className = "material-icons icon";
		iLogin.innerHTML = "email";
		iPassword.className = "material-icons icon";
		loginBtn.type = "submit";
		loginBtn.className = "btn";
		loginBtn.innerHTML = "Login";

		iPassword.innerHTML = "lock";

		loginDiv.appendChild(iLogin);
		loginDiv.appendChild(loginInput);
		passwordDiv.appendChild(iPassword);
		passwordDiv.appendChild(passwordInput);
		loginForm.appendChild(loginDiv);
		loginForm.appendChild(passwordDiv);
		loginForm.appendChild(loginBtn);
		mailDiv.appendChild(loginForm);

		loginBtn.addEventListener("mousedown", function(){
			self.sendLoginData();
		});
	}

	this.sendLoginData = function()
	{
		var obj = new Object();
		obj.name = "ro";
		obj.password = "ro";
		socket.send(JSON.stringify({"mail": obj}));
		console.log("On envoie");
	}

	this.login = function(mail)
	{
		if (mail.content)
		{
			this.mailObj = mail;
			this.displayFolder(mail);
		}
		else
		{
			// var loginForm = document.getElementById("login-form");
			// if (loginForm.children.length < 4)
			// {
			// 	var errorForm = document.createElement("p");
			// 	errorForm.innerHTML = "Invalid login or password";
			// 	loginForm.insertBefore(errorForm, loginForm.firstChild);
			// }
			console.log("WRONG LOGIN");

		}


	}
}
