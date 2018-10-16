/*
 * Create a li for him and me
 */
var SOCIAL = function(notif_button_cb) {
	var self = this;

	var socialDiv = document.getElementById("social");
	var contactsListDiv = document.getElementById("contacts_list");
	var currentNameDiv;
	var currentMessagesDiv;
	var currentAnswersDiv;
	var currentMessengerDiv;
	var currentZindex = 0;

	this.addEntry = function(obj)
	{
		var div = document.getElementById(obj.name);
		if (div === undefined) {
			this.createMessenger(obj.name)
		}
		this.showName(obj.name);
		this.addHim(obj.q);
		this.showAnswer(obj.r);
	}

	this.createDialogBox = function(messengerDiv)
	{
		currentNameDiv = document.createElement('div');
		currentNameDiv.setAttribute("class", "contact_name");
		messengerDiv.appendChild(currentNameDiv);

		currentMessagesDiv = document.createElement('ul');
		currentMessagesDiv.setAttribute("class", "messages");
		messengerDiv.appendChild(currentMessagesDiv);

		currentAnswersDiv = document.createElement('div');
		currentAnswersDiv.setAttribute("class", "answers");
		messengerDiv.appendChild(currentAnswersDiv);

		this.createBackButton();

		currentMessagesDiv.addEventListener(mousewheelevt, function (e) {
			var e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			currentMessagesDiv.scrollTop -= delta * 20;
		}, false);
	}

	this.createMessenger = function(idName)
	{
		currentMessengerDiv = document.createElement('div');
		currentMessengerDiv.setAttribute("class", "messenger");
		currentMessengerDiv.setAttribute("id", idName);
		socialDiv.appendChild(currentMessengerDiv);
		currentMessengerDiv.style.zIndex = currentZindex++;
		this.createDialogBox(currentMessengerDiv);
	}

	this.addMe = function(str)
	{
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "me");
		currentMessagesDiv.appendChild(li);
		currentMessagesDiv.scrollTop += 10000;
	}

	this.addHim = function(str)
	{
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "him");
		currentMessagesDiv.appendChild(li);
		currentMessagesDiv.scrollTop += 10000;
	}

	/*
	 * Write name and create buttons according to received number
	 */
	this.showName = function(str)
	{
		currentNameDiv.innerHTML = str;
	}

	this.showAnswer = function(tab)
	{
		var i = 0;
		i = tab.length - 1;
		while (i >= 0)
		{
			var b = document.createElement('button');
			b.addEventListener("mousedown", function () {
				sendAnswer(this.z);
			});
			b.setAttribute("class", "btn");
			b.z = i;
			b.innerHTML = tab[i];
			currentAnswersDiv.insertAdjacentElement('afterbegin', b);
			i--;
		}
	}

	this.createBackButton = function()
	{
		var b = document.createElement('button');
		b.addEventListener("mousedown", function () {
			notif_button_cb("social", false, true);
			contactsListDiv.style.zIndex = currentZindex++;
		});
		b.setAttribute("class", "backBtn");
		b.innerHTML = "BACK";
		currentAnswersDiv.appendChild(b);
	}

	/*
	 * remove all buttons and create new ones
	 */
	var removeButton = function()
	{
		var btns = currentMessengerDiv.getElementsByClassName('btn');
		while(btns[0])
			btns[0].parentNode.removeChild(btns[0]);
	}

	/*
	 * send answer to server
	 */
	var sendAnswer = function(clicked_id)
	{
		var obj = new Object();
		obj.r = clicked_id;
		var classCollection = currentAnswersDiv.getElementsByClassName("btn");
		self.addMe(classCollection[clicked_id].innerHTML);
		obj.name = currentNameDiv.innerHTML;
		socket.send(JSON.stringify({"social":obj}));
		removeButton();
	}

	/*
	 * Get contacts_list div (container for all the contacts)
	 */
	this.displayContacts = function(contactsArray)
	{
		for (var i = 0; i < contactsArray.length; i++)
		{
			(function () {
				/*
				 * Create a new contact div
				 */
				var contact = document.createElement('div');
				contact.className = "contact";

				/*
				 * Add EventListener to contact div to send contact name to the server
				 */
				var obj = new Object();
				obj.name = contactsArray[i];
				contact.addEventListener("mousedown", function (){
					var div = document.getElementById(obj.name);
					/*
					 * Test of messenger div already exist
					 */
					if (div === undefined) {
						socket.send(JSON.stringify({"social": obj}));
					} else {
						div.style.zIndex = currentZindex++;
						currentMessengerDiv = div;
						currentNameDiv = currentMessengerDiv.getElementsByClassName("contact_name")[0];
						currentMessagesDiv = currentMessengerDiv.getElementsByClassName("messages")[0];
						currentAnswersDiv = currentMessengerDiv.getElementsByClassName("answers")[0];
						socket.send(JSON.stringify({"social": obj}));
					}
				});

				/*
				 * Create a new img
				 */
				var img = document.createElement('img');
				img.src = "/medias/macaron.jpg";
				img.alt = "contact_picture";

				/*
				 * Create a new contact_name div
				 */
				var contact_name = document.createElement('div');
				contact_name.className = "contact_name";

				/*
				 * Create a new paragraph
				 */
				var paragraph = document.createElement('p');
				paragraph.textContent = contactsArray[i];

				/*
				 * Append all these new elements to their parents div
				 */
				contact_name.appendChild(paragraph);
				contact.appendChild(img);
				contact.appendChild(contact_name);
				contactsListDiv.appendChild(contact);

				notif_button_cb("social", true, true);
			}());
		}
	}
}