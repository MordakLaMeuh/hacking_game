
var DIARY = function() {
	var self = this;

	var diaryDiv = document.getElementById("diary");
	
	this.addEntry = function(str)
	{
		diaryDiv.innerHTML += str + "<br>";
	}
}