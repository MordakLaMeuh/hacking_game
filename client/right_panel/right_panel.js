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

	this.displayContacts = function(contactsArray)
	{
		for (var i = 0; i < contactsArray.length; i++)
		{
			// Get contacts_list div (container for all the contacts)
			var contacts_list = document.getElementById("contacts_list");

			// Create a new contact div
			var contact = document.createElement('div');
			contact.className = "contact";

			// Add EventListener to contact div to send contact name to the server
			var obj = new Object();
			obj.name = contactsArray[i];
			contact.addEventListener("mousedown", function (){
				console.log("OK");
				socket.send(JSON.stringify({"social": obj}));
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
		}
	}
}
