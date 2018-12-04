'use strict'
var passwordInput = document.getElementById("passwordInput");
var passwordOutput = document.getElementById("passwordOutput");
var okButtonPassword = document.getElementById("okButtonPassword");
var rot = document.getElementById("rot");
var sha1 = document.getElementById("sha1");
var md5 = document.getElementById("md5");
var reverseText = document.getElementById("reverseText");
var encryptionCheckboxArray = document.getElementsByClassName("encryptionCheckbox");

var functionAvailable = new Map([
	["rot", rotStr],
	["reverseText", reverseStr]
]);
var functionToApplyArray = [];

okButtonPassword.addEventListener("mousedown", function(e)
{
	passwordOutput.value = passwordInput.value;
	for (let i = 0; i < encryptionCheckboxArray.length; i++)
	{
		console.log("id = " + encryptionCheckboxArray[i]);
		encryptionCheckboxArray[i].checked = "";
	}
	functionToApplyArray = [];
}, false);



for (let i = 0; i < encryptionCheckboxArray.length; i++)
{
	encryptionCheckboxArray[i].addEventListener("change", function()
	{
		let encryptionFunction = functionAvailable.get(encryptionCheckboxArray[i].id);
		if (encryptionFunction == undefined)
		{
			console.warn("Encryption function is not founded.");
			return ;
		}
		if (encryptionCheckboxArray[i].checked)
		{
			functionToApplyArray.push(encryptionFunction);
			passwordOutput.value = encryptionFunction(passwordOutput.value);
		}
		else
		{
			let index = functionToApplyArray.indexOf(encryptionFunction);
			if (index != null)
			{
				functionToApplyArray.splice(index, 1);
				passwordOutput.value = passwordInput.value;
				for (let i = 0; i < functionToApplyArray.length; i++)
				{
					passwordOutput.value = functionToApplyArray[i](passwordOutput.value);
				}
			}
			else
				console.warn("Encryption function is not founded.");
		}
	}, false);
}


function rotStr(str) {
	let alphabet = "abcdefghijklmnopqrstuvwxyz";
	let newStr = "";
	let num = 13;
	num = num % 26;
	for (let i = 0; i < str.length; i++) {
		let char = str[i],
		isUpper = (char === char.toUpperCase()) ? true : false;
		char = char.toLowerCase();
		if (alphabet.indexOf(char) > -1) {
			let newIndex = alphabet.indexOf(char) + num;
			if(newIndex < alphabet.length) {
				isUpper ? newStr += alphabet[newIndex].toUpperCase() : newStr += alphabet[newIndex];
			} else {
				let shiftedIndex = -(alphabet.length - newIndex);
				isUpper ? newStr += alphabet[shiftedIndex].toUpperCase() : newStr += alphabet[shiftedIndex];
			}
		} else {
			newStr += char;
		}
	}
	return newStr;
}

function reverseStr(str)
{
	console.log("on rentre");
	let newStr = "";
	for (let i = str.length - 1; i >= 0; i--)
	{
		let char = str[i];
		newStr += char;
	}
	return (newStr);
}
