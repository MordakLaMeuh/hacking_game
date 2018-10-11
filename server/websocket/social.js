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
}

}

