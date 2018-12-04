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
	//Copy input value to output value
	passwordOutput.value = passwordInput.value;
	//Uncheck all checkbox
	for (let i = 0; i < encryptionCheckboxArray.length; i++)
	{
		console.log("id = " + encryptionCheckboxArray[i]);
		encryptionCheckboxArray[i].checked = "";
	}
	//reset functionToApplyArray
	functionToApplyArray = [];
}, false);


//Loop trough all encryptionCheckbox elements
for (let i = 0; i < encryptionCheckboxArray.length; i++)
{
	//add addEventListener on change to all encryptionCheckbox
	encryptionCheckboxArray[i].addEventListener("change", function()
	{
		//get the correct encryptionFunction compared to encryptionCheckboxArray[i].id
		let encryptionFunction = functionAvailable.get(encryptionCheckboxArray[i].id);
		if (encryptionFunction == undefined)
		{
			console.warn("Encryption function is not founded.");
			return ;
		}
		if (encryptionCheckboxArray[i].checked)
		{
			//save the function to apply in an array
			functionToApplyArray.push(encryptionFunction);
			//change output value with the encryptionFunction
			passwordOutput.value = encryptionFunction(passwordOutput.value);
		}
		else
		{
			//get encryptionFunction index in functionToApplyArray
			let index = functionToApplyArray.indexOf(encryptionFunction);
			if (index != null)
			{
				//remove encryptionFunction from functionToApplyArray
				functionToApplyArray.splice(index, 1);
				//reset output value to the original input value
				passwordOutput.value = passwordInput.value;
				//apply all encryptionFunction checked in the right order to output value
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
