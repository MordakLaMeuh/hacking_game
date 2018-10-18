let Keyboard = window.SimpleKeyboard.default;

let myKeyboard = new Keyboard({
	onChange: input => onChange(input),
	onKeyPress: button => onKeyPress(button),
	layout: {
		theme: "hg-theme-default",

		default: [
			"1 2 3 4 5 6 7 8 9 0 {bksp}",
			"q w e r t y u i o p -",
			"a s d f g h j k l {enter}",
			"z x c v b n m , . / {shift}",
			"{space}"
		]
}}
);

function onChange(input) {
	document.querySelector(".input").value = input;
	console.log("Input changed", input);
}

function onKeyPress(button) {
	console.log("Button pressed", button);
}

