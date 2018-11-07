'use strict';

var SOCIAL = function(notif_button_cb) {
	var socialDiv = document.getElementById("social");
	var contactsListDiv = document.getElementById("contacts_list");
	var currentNameDiv;
	var currentMessagesDiv;
	var currentAnswersDiv;
	var currentMessengerDiv;
	var currentZindex = 0;

	function createDialogBox(messengerDiv) {
		currentNameDiv = document.createElement('div');
		currentNameDiv.setAttribute("class", "contact_name");
		messengerDiv.appendChild(currentNameDiv);

		currentMessagesDiv = document.createElement('ul');
		currentMessagesDiv.setAttribute("class", "messages");
		messengerDiv.appendChild(currentMessagesDiv);

		currentAnswersDiv = document.createElement('div');
		currentAnswersDiv.setAttribute("class", "answers");
		messengerDiv.appendChild(currentAnswersDiv);

		createBackButton();

		currentMessagesDiv.addEventListener(mousewheelevt, function (e) {
			e = window.event || e; // old IE support
			let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			currentMessagesDiv.scrollTop -= delta * 20;
		}, false);
	}

	function createMessenger(idName) {
		currentMessengerDiv = document.createElement('div');
		currentMessengerDiv.setAttribute("class", "messenger");
		currentMessengerDiv.setAttribute("id", idName);
		socialDiv.appendChild(currentMessengerDiv);
		currentMessengerDiv.style.zIndex = currentZindex++;
		createDialogBox(currentMessengerDiv);
	}

	function addMe(str) {
		let li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "me");
		currentMessagesDiv.appendChild(li);
		currentMessagesDiv.scrollTop += currentMessagesDiv.scrollHeight;
	}

	function addHim(str) {
		let li = document.createElement('li');
		li.appendChild(document.createTextNode(str));
		li.setAttribute("class", "him");
		currentMessagesDiv.appendChild(li);
		currentMessagesDiv.scrollTop += currentMessagesDiv.scrollHeight;
	}

	/*
	 * Write name and create buttons according to received number
	 */
	function showName(str) {
		currentNameDiv.innerHTML = str;
	}

	function showAnswer(tab) {
		let i = 0;
		i = tab.length - 1;
		while (i >= 0) {
			let b = document.createElement('button');
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

	function createBackButton() {
		let b = document.createElement('button');
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
	function removeButton() {
		let btns = currentMessengerDiv.getElementsByClassName('btn');
		while(btns[0])
			btns[0].parentNode.removeChild(btns[0]);
	}

	/*
	 * send answer to server
	 */
	function sendAnswer(clicked_id) {
		let obj = new Object();
		obj.r = clicked_id;
		let classCollection = currentAnswersDiv.getElementsByClassName("btn");
		addMe(classCollection[clicked_id].innerHTML);
		obj.name = currentNameDiv.innerHTML;
		socket.send(JSON.stringify({"social":obj}));
		removeButton();
	}

	this.addEntry = function(obj)
	{
		let div = document.getElementById(obj.name);
		if (div == undefined) {
			createMessenger(obj.name)
		}
		showName(obj.name);
		addHim(obj.q);
		showAnswer(obj.r);
	}

	/*
	 * Get contacts_list div (container for all the contacts)
	 */
	this.displayContacts = function(contactsArray)
	{
		for (let i = 0; i < contactsArray.length; i++) {
			(function () {
				/*
				 * Create a new contact div
				 */
				let contact = document.createElement('div');
				contact.className = "contact";

				/*
				 * Add EventListener to contact div to send contact name to the server
				 */
				let obj = new Object();
				obj.name = contactsArray[i];
				contact.addEventListener("mousedown", function (){
					let div = document.getElementById(obj.name);
					/*
					 * Test of messenger div already exist
					 */
					if (div == undefined) {
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
				let img = document.createElement('img');
				img.src = "/medias/contact.svg";
				img.alt = "contact_picture";
				img.style.backgroundColor = "#57D1FA";

				/*
				 * Create a new contact_name div
				 */
				let contact_name = document.createElement('div');
				contact_name.className = "contact_name";

				/*
				 * Create a new paragraph
				 */
				let paragraph = document.createElement('p');
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
