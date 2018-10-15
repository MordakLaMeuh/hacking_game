var MAIL = function()
{
	// this connectToMail = function(name, password)
	// {
	// 	var obj = new Object();
	// 	obj.name = name;
	// 	obj.password = password;
	// 	socket.send(JSON.stringify({"email": obj}));
	// }

	this.displayMailList = function(mail)
	{
		console.log("ICI");
		// console.log(mail);
		// console.log(mail_list[0].content[0].title);
		var mailMessagesUl = document.getElementById("mail_messages");
		// while (mailMessagesUl.firstChild)
		// {
		// 	mailMessagesUl.removeChild(mailMessagesUl.firstChild);
		// }
		this.removeMailList(mailMessagesUl);

		for (var i = 0; i < mail.content.length; i++)
		{
			var mailLiContainer = document.createElement("li");
			var mailUlContainer = document.createElement("ul");

			var senderLi = document.createElement("li");
			var receiverLi = document.createElement("li");
			var titleLi = document.createElement("li");

			senderLi.className = "from";
			receiverLi.className = "to";
			titleLi.className = "title";

			senderLi.content = 	mail.content[i].from_to;
			receiverLi.content = mail.login;
			titleLi.content = mail.content[i].title;

			mailUlContainer.appendChild(senderLi);
			mailUlContainer.appendChild(receiverLi);
			mailUlContainer.appendChild(titleLi);

			mailLiContainer.appendChild(mailUlContainer);
			mailMessagesUl.appendChild(mailLiContainer);

			mailLiContainer.addEventListener("mousedown", function(){
				this.displayMailContent(mailMessagesUl, mail, index);
			});
		}
	}

	this.removeMailList = function(mailList)
	{
		while (mailList.firstChild)
		{
			mailList.removeChild(mailList.firstChild);
		}

	}
	this.displayMailContent = function(mailList, mail, index)
	{
		console.log("on recoit");
		this.removeMailList(mailList);
		var mailInfoBarUl = document.getElementById("mail_info_bar");
		for (var i = 0; i < mailInfoBarUl.children.length; i++)
		{
			mailInfoBarUl.children[i].visibilty = "hidden";
		}
		var from = document.createElement("li");
		var to = document.createElement("li");
		var title = document.createElement("li");

		from.content = mail.content[index].from_to;
		to.content = mail.name;
		title.content = mail.content[index].content;

		var obj = new Object();
		obj.name = mail.name;
		obj.index = index;
		socket.send(JSON.stringify({"mail": obj}));

	}

}
