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

// Create a li for him and me

function addMe(str)
{
	var ul = document.getElementById("messages");
	var li = document.createElement('li');
	li.appendChild(document.createTextNode(str));
	li.setAttribute("class", "me");
	ul.appendChild(li);
}

function addHim(str)
{
	var ul = document.getElementById("messages");
	var li = document.createElement('li');
	li.appendChild(document.createTextNode(str));
	li.setAttribute("class", "him");
	ul.appendChild(li);
}

// Write name and create buttons according to received number

function showName(str)
{
	var name = document.getElementById("contact_name");
	name.innerHTML = str;
}

function showAnswer(tab)
{
	var answers = document.getElementById("answers");
	var i = 0;
	while (i < tab.length)
	{
		var b = document.createElement('button');
		b.id = i;
		b.setAttribute("onClick", "sendAnswer(this.id)");
		b.innerHTML = tab[i];
		answers.appendChild(b);
		i++;
	}
}

/* send answer to server */

function sendAnswer(clicked_id)
{
	var obj = new Object();
	obj.r = clicked_id;
	addMe(document.getElementById(clicked_id).innerHTML);
	obj.name = document.getElementById("contact_name").innerHTML;
	socket.send(JSON.stringify({"social":obj}));
}