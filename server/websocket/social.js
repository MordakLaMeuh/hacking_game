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
		var n = this.social.length - 1;
		this.social[n].active = false;
		this.social[n].idx = 0;
		if (this.social[n].mail != undefined)
		{
			for(var j = 0; j < this.social[n].mail.length ; j++)
			{
				this.social[n].mail[j].read = false;
				console.log(this.social[n].mail[j].read);
			}
		}
	 }
},
createContactList: function()
{
	var output = new Array();

	for (var i = 0; i < this.social.length; i++) {
		if (this.social[i].exchange != undefined)
			output.push(this.social[i].name);
	}

	console.log("CreateContactList len: " + this.social.length + " output");
	console.log(output);

	return output;
},
displayObj: function(name, password)
{
	console.log(this.social);
},


	sendMail: function(obj) {
		var output = new Array();
		for (var i = 0; i < this.social.length; i++)
		{
			if (this.social[i].name == obj.login && this.social[i].password == obj.password &&
				this.social[i].mail != undefined)
			{
				var o = new Object();
				o.content = this.social[i].mail;
				o.name = this.social[i].name;
				console.log("IDENTIFICATION OK");
				output.push(o);
				break;
			}
			else
			{
				console.log("BAD ID");
			}
		}
		console.log(output);
		return output;
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