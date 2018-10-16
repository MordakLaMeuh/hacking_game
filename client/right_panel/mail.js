var MAIL = function()
{
	var self = this;
	this.mailObj;
	var onFolder = true;

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

	this.displayFolder = function()
	{
		if (!onFolder)
		{
			this.displayMailList(this.mailObj);
			onFolder = true;
			this.changeMailHeader(onFolder);
		}

	}

	this.displayMailList = function(mail)
	{
		this.mailObj = mail;
		var mailMessagesUl = document.getElementById("mail_messages");
		this.removeMailList(mailMessagesUl);
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

	this.signOut = function()
	{
		// if (root root se reloguer directmeent)
		//creation d'une div pour tout contenir ??
		var mailHeaderDiv = document.getElementById("mail_header");
		var mailBodyDiv = document.getElementById("mail_body");
		var mailDiv = document.getElementById("mail");
		var signInForm = document.createElement("form");
		var loginDiv = document.createElement("div");
		var passwordDiv = document.createElement("div");
		var loginInput = document.createElement("input");
		var passwordInput = document.createElement("input");
		var iLogin = document.createElement("i");
		var iPassword = document.createElement("i");
		var loginBtn = document.createElement("button");


		mailHeaderDiv.style.display = "none";
		mailBodyDiv.style.display = "none";

		loginDiv.className = "input-container";
		passwordDiv.className = "input-container";

		loginInput.className = "input-field";
		passwordInput.className = "input-field";

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
		signInForm.appendChild(loginDiv);
		signInForm.appendChild(passwordDiv);
		signInForm.appendChild(loginBtn);
		mailDiv.appendChild(signInForm);
	}

}
