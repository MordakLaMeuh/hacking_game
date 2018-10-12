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
				if (this.social[i].exchange[this.social[i].idx].s)
					output.s = this.social[i].exchange[this.social[i].idx].s;
				this.social[i].active = true;
			} else {
				var newIdx;
				if (obj.r != undefined) {
					if (obj.r < 0 || obj.r >= this.social[i].exchange[this.social[i].idx].r.length) {
						console.warn("bad index: " + obj.r);
						return;
					}
					newIdx = this.social[i].exchange[this.social[i].idx].i[obj.r];
				} else {
					if (this.social[i].exchange[this.social[i].idx].r.length == 0 &&
							this.social[i].exchange[this.social[i].idx].i != undefined) {
						newIdx = this.social[i].exchange[this.social[i].idx].i[0];
					} else {
						console.log("already activated");
						return;
					}
				}
				this.social[i].idx = newIdx;
				output.q = this.social[i].exchange[this.social[i].idx].q;
				output.r = this.social[i].exchange[this.social[i].idx].r;
				if (this.social[i].exchange[this.social[i].idx].s)
					output.s = this.social[i].exchange[this.social[i].idx].s;
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