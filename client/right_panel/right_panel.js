'use strict';

var RIGHT_PANEL = function() {
	var right_panel = document.getElementById("right_panel");

	var mail = document.getElementById("mail");
	var browser = document.getElementById("browser");
	var social = document.getElementById("phone");
	var diary = document.getElementById("notebook");

	function changeScreen(button, target) {
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].classList.remove("active");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(target).style.display = "block";
		button.classList.add("active");
		console.log(button);
	}

	mail_btn.addEventListener("mousedown", function (){
		changeScreen(this, "mail");
	});

	browser_btn.addEventListener("mousedown", function () {
		changeScreen(this, "browser");
	});

	sms_btn.addEventListener("mousedown", function (){
		changeScreen(this, "phone");
	});

	diary_btn.addEventListener("mousedown", function () {
		changeScreen(this, "notebook");
	});

	this.onmessage  = function(data) {
		if (data.victory) {
			diary.innerHTML += data.victory + "<br>";
		}
		if (data.mail) {
			mail.innerhtml += data.mail + "<br>";
		}
		if (data.social) {
			social.innerHTML += data.social + "<br>";
		}
		if (data.browser) {
			browser.innerHTML += data.browser + "<br>";
		}
	}
	changeScreen(diary_btn, "notebook");
}

/*
<div id="contact_name"></div><hr/>
<ul id="messages">
</ul>
<div id="answers"></div> -->
*/

/*
 * Create a li for him and me
 */
var SOCIAL = function() {
	var self = this;
	var phone = document.getElementById("phone");

	var name;
	var messages;
	var answers;
	var messenger;
	var currentZindex = 0;

	this.addEntry = function(obj)
	{
		var div = document.getElementById(obj.name);
		if (div == undefined) {
			this.createMessenger(obj.name)
		}
		this.showName(obj.name);
		this.addHim(obj.q);
		this.showAnswer(obj.r);
		this.createButton();
	}

	this.createDialogBox = function(messengerDiv)
	{
		name = document.createElement('div');
		name.setAttribute("class", "contact_name");
		messengerDiv.appendChild(name);

		messages = document.createElement('ul');
		messages.setAttribute("class", "messages");
		messengerDiv.appendChild(messages);

		answers = document.createElement('div');
		answers.setAttribute("class", "answers");
		messengerDiv.appendChild(answers);

		messages.addEventListener(mousewheelevt, function (e) {
			var e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			messages.scrollTop -= delta * 20;
		}, false);
	}

	this.createMessenger = function(idName)
	{
		messenger = document.createElement('div');
		messenger.setAttribute("class", "messenger");
		messenger.setAttribute("id", idName);
		phone.appendChild(messenger);
		messenger.style.zIndex = currentZindex++;
		this.createDialogBox(messenger);
	}

	this.addMe = function(str)
	{
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "me");
		messages.appendChild(li);
		messages.scrollTop += 10000;
	}

	this.addHim = function(str)
	{
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "him");
		messages.appendChild(li);
		messages.scrollTop += 10000;
	}

	/*
	 * Write name and create buttons according to received number
	 */
	this.showName = function(str)
	{
		var name = messenger.getElementsByClassName("contact_name")[0];
		name.innerHTML = str;
	}

	this.showAnswer = function(tab)
	{
		var answers = messenger.getElementsByClassName("answers")[0];
		var i = 0;
		while (i < tab.length)
		{
			var b = document.createElement('button');
			b.id = i;
			b.addEventListener("mousedown", function () {
				sendAnswer(this.id);
			});
			b.setAttribute("class", "btn");
			b.innerHTML = tab[i];
			answers.appendChild(b);
			i++;
		}
	}

	this.createButton = function()
	{
		var answers = messenger.getElementsByClassName("answers")[0];
		var b = document.createElement('button');
		b.addEventListener("mousedown", function () {
			contacts_list.style.zIndex = currentZindex++;
		});
		b.setAttribute("class", "btn");
		b.innerHTML = "BACK";
		answers.appendChild(b);
	}

	/*
	 * remove all buttons and create new ones
	 */
	var removeButton = function()
	{
		var btns = messenger.getElementsByClassName('btn');
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
		self.addMe(document.getElementById(clicked_id).innerHTML);
		obj.name = messenger.getElementsByClassName("contact_name")[0].innerHTML;
		socket.send(JSON.stringify({"social":obj}));
		removeButton();
	}

	// Get contacts_list div (container for all the contacts)
	var contacts_list = document.getElementById("contacts_list");
	this.displayContacts = function(contactsArray)
	{
		contacts_list.style.zIndex = currentZindex++;

		// Remove old children before display new
		while (contacts_list.firstChild) {
			contacts_list.removeChild(contacts_list.firstChild);
		}

		for (var i = 0; i < contactsArray.length; i++)
		{
			(function () {
				// Create a new contact div
				var contact = document.createElement('div');
				contact.className = "contact";

				// Add EventListener to contact div to send contact name to the server
				var obj = new Object();
				obj.name = contactsArray[i];
				contact.addEventListener("mousedown", function (){
					var div = document.getElementById(obj.name);
					if (div == undefined) {
						socket.send(JSON.stringify({"social": obj}));
					} else {
						div.style.zIndex = currentZindex++;
						messenger = div;
						name = messenger.getElementsByClassName("contact_name")[0];
						messages = messenger.getElementsByClassName("messages")[0];
						answers = messenger.getElementsByClassName("answers")[0];
					}
				});

				// Create a new img
				var img = document.createElement('img');
				img.src = "/medias/macaron.jpg";
				img.alt = "contact_picture";

				// Create a new contact_name div
				var contact_name = document.createElement('div');
				contact_name.className = "contact_name";

				// Create a new paragraph
				var paragraph = document.createElement('p');
				paragraph.textContent = contactsArray[i];

				// Append all these new elements to their parents div
				contact_name.appendChild(paragraph);
				contact.appendChild(img);
				contact.appendChild(contact_name);
				contacts_list.appendChild(contact);
			}());
		}
	}
}
