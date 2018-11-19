'use strict';

var SOCIAL = function(notif_button_cb, socket) {
	var socialDiv = document.getElementById("social");
	var contactsListDiv = document.getElementById("contacts_list");
	var currentNameDiv;
	var currentMessagesDiv = undefined;
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

		/*
		 * Associate currentMessengerDiv to name
		 */
		for (let i = 0; i < contactList.length; i++) {
			if (contactList[i].name == idName) {
				contactList[i].messengerDiv = currentMessengerDiv;
				break;
			}
		}
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
		currentMessagesDiv.scrollTop += currentMessagesDiv.scrollHeight;
	}

	function createBackButton() {
		let b = document.createElement('button');
		b.addEventListener("mousedown", function () {
			currentDialog = "";
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
	function removeButton(div) {
		if (div === undefined)
			return;

		let btns = div.getElementsByClassName('btn');
		while(btns[0])
			btns[0].parentNode.removeChild(btns[0]);
	}

	var blockEntryCountdown = 0;		// Special variable, initialize a countDown for blocking a entry
	var waitingForAnswer = false;		// Indicate if we are waiting for an PNJ answer
	var contactList = new Array();		// List of all contacts {name, messengerDiv}
	var currentDialog = "";				// Inform if a dialog sequence with someone is active

	/*
	 * send answer to server
	 */
	function sendAnswer(clicked_id) {
		let obj = new Object();
		obj.r = clicked_id;
		let classCollection = currentAnswersDiv.getElementsByClassName("btn");
		addMe(classCollection[clicked_id].innerHTML);
		obj.name = currentNameDiv.innerHTML;
		removeButton(currentMessengerDiv);
		notif_button_cb("social", false, true);

		waitingForAnswer = true;

		socket.send({"social":obj});
	}

	function addEntry(obj)
	{
		waitingForAnswer = false;

		if (blockEntryCountdown > 0) {
			blockEntryCountdown -= 1;
			if (blockEntryCountdown == 0) {
				return;
			}
		}
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
	function displayContacts(contactsArray)
	{
		for (let i = 0; i < contactsArray.length; i++) {
			let isAlreadyKnew = false;

			contactList.forEach(function(contact) {
				/*
				 * Check if contact already exist
				 */
				let name = contact.name;

				if (name == contactsArray[i]) {
					isAlreadyKnew = true;
					/*
					 * test if on a current dialog
					 */
					let ImgID = document.getElementById(contactsArray[i] + "ImgID");
					if (currentDialog == name) {
						/*
						 * check if social victory, in this case, we are on 'waiting for answer' state
						 * so block the (next next) dialog sequence (become obsolete)
						 */
						if (waitingForAnswer == true) {
							blockEntryCountdown = 2;
						} else {
							/*
							 * In case of active dialog but not a social victory; just remove old answers
							 */
		 					if (ImgID !== undefined)
		 						ImgID.classList.add("notifSocial");
							removeButton(contact.messengerDiv);
						}
						socket.send({"social": {"name" : name}});
					} else {
						/*
						 * In case of non active dialog; just remove old answers
						 */
						if (ImgID !== undefined)
							ImgID.classList.add("notifSocial");
						removeButton(contact.messengerDiv);
					}
					notif_button_cb("social", true, true);
				}
			});

			/*
			 * Add contact routine
			 */
			if (isAlreadyKnew == false) {

				(function () {
					/*
					 * Create a new contact div
					 */
					let contact = document.createElement('div');
					contact.className = "contact";

					let obj = new Object();
					obj.name = contactsArray[i];

					/*
					 * Register new contact name
					 */
					contactList.push(obj);

					/*
					 * Add EventListener to contact div to send contact name to the server
					 */
					contact.addEventListener("mousedown", function (){
						let div = document.getElementById(obj.name);
						currentDialog = obj.name;
						contact.firstChild.classList.remove("notifSocial");
						notif_button_cb("social", false, true);
						/*
						 * Test of messenger div already exist
						 */
						if (div == undefined) {
							socket.send({"social": obj});
						} else {
							div.style.zIndex = currentZindex++;
							currentMessengerDiv = div;
							currentNameDiv = currentMessengerDiv.getElementsByClassName("contact_name")[0];
							currentMessagesDiv = currentMessengerDiv.getElementsByClassName("messages")[0];
							currentAnswersDiv = currentMessengerDiv.getElementsByClassName("answers")[0];

							socket.send({"social": obj});
						}
					});

					/*
					 * Create a new img
					 */
					let img = document.createElement('img');
					img.src = "medias/contact.svg";
					img.alt = "contact_picture";
					img.style.backgroundColor = "#57D1FA";
					img.classList.add("notifSocial");
					img.id = contactsArray[i] + "ImgID";

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

	this.active = function() {
		if (currentMessagesDiv !== undefined)
			currentMessagesDiv.scrollTop += currentMessagesDiv.scrollHeight;
	}

	socket.register(["socialContacts"], displayContacts);
	socket.register(["social"], addEntry);
}
