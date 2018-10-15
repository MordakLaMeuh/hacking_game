var MAIL = function()
{
	// this connectToMail = function(name, password)
	// {
	// 	var obj = new Object();
	// 	obj.name = name;
	// 	obj.password = password;
	// 	socket.send(JSON.stringify({"email": obj}));
	// }

	this displayMailList = function(email_list)
	{
		var mailMessagesUl = document.getElementById("mail_messages");

		while (mailMessagesUl.firstChild)
		{
			mailMessagesUl.removeChild(mailMessagesUl.firstChild);
		}

		for (var i = 0; i < email_list.length; i++)
		{
			var emailLiContainer = document.createElement("li");
			var emailUlContainer = document.createElement("ul");

			var senderLi = document.createElement("li");
			var receiverLi = document.createElement("li");
			var subjectLi = document.createElement("li");

			senderLi.className = "from";
			receiverLi.className = "to";
			subjectLi.className = "subject";

			senderLi.content = email_list[i][0];
			receiverLi.content = email_list[i][1];
			subjectLi.content = email_list[i][2];

			emailUlContainer.appendChild(senderLi);
			emailUlContainer.appendChild(receiverLi);
			emailUlContainer.appendChild(subjectLi);

			emailLiContainer.appendChild(emailUlContainer);
			mailMessagesUl.appendChild(emailLiContainer);
		}
	}

	this displayMailContent = function()
	{

	}

}
