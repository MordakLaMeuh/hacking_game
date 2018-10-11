module.exports =
{
constructor: function()
{
	this.social = new Array();
},
addEntries: function(obj)
{
	for (var i = 0; i < obj.length; i++) {
		this.social.push(obj[i]);
		this.social[this.social.length - 1].active = true;
		this.social[this.social.length - 1].idx = 0;
	}
},
createContactList: function()
{
	var output = new Array();

	for (var i = 0; i < this.social.length; i++)
		output.push(this.social[i].name);

	console.log("CreateContactList len: " + this.social.length + " output");
	console.log(output);

	return output;
},
displayObj: function()
{
	console.log(this.social);
},
getDialogSeq: function(obj)
{
	var output = new Object();

	for (var i = 0; i < this.social.length; i++) {
		if (this.social[i].name == obj.name) {
			output.name = obj.name;

			if (obj.idx >= this.social[i].exchange.length) {
				console.warn("unexpected index: " + obj.idx);
				return;
			}
			var input = this.social[i].exchange[obj.idx];
			console.log("name founded !");
			console.log(input);
		}
	}
	console.log(obj);
	return "";
}
}

