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
		this.social[this.social.length - 1].active = false;
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
	console.log(obj);

	if (obj.name == undefined) {
		console.warn("undefined name field")
		return;
	}
	var i = 0;
	for (i = 0; i < this.social.length; i++) {
		if (this.social[i].name == obj.name) {
			output.name = obj.name;
			if (this.social[i].active == false) {
				output.q = this.social[i].exchange[this.social[i].idx].q;
				output.r = this.social[i].exchange[this.social[i].idx].r;
				this.social[i].active = true;
			} else {
				if (obj.r == undefined) {
					console.log("already activated");
					return;
				}
				console.log("length: " + this.social[i].exchange[this.social[i].idx].r.length);
				if (obj.r < 0 || obj.r >= this.social[i].exchange[this.social[i].idx].r.length) {
					console.warn("bad index: " + obj.r);
					return;
				}
				var newIdx = this.social[i].exchange[this.social[i].idx].i[obj.r];
				this.social[i].idx = newIdx;
				console.log("newIdx: " + this.social[i].idx);
				output.q = this.social[i].exchange[this.social[i].idx].q;
				output.r = this.social[i].exchange[this.social[i].idx].r;
			}
			break;
		}
	}
	if (i == this.social.length) {
		console.warn("unknown name: " + obj.name);
		return;
	}
	console.log(output);
	return output;
}
}