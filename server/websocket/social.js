module.exports =
{
constructor: function()
{
	this.social = new Array();
},

/*
 * Add new social entries and return new png name with exchange feature
 */
addEntries: function(obj)
{
	var output = new Array();

	for (var i = 0; i < obj.length; i++) {
		this.social.push(obj[i]);
		var n = this.social.length - 1;
		if (this.social[n].exchange !== undefined)
			output.push(this.social[n].name);
		this.social[n].active = false;
		this.social[n].idx = 0;
		if (this.social[n].mail !== undefined) {
			for (var j = 0; j < this.social[n].mail.length; j++) {
				this.social[n].mail[j].read = false;
			}
		}
	 }
	return output;
},

sendMail: function(obj) {
	for (var i = 0; i < this.social.length; i++) {
		if (this.social[i].name == obj.name
			&& this.social[i].password !== undefined
			&& this.social[i].password == obj.password
			&& this.social[i].mail !== undefined) {
			return this.social[i].mail;
		} else {
			console.warn("Cannot access mailbox for " + this.social[i].name);
		}
	}
	return undefined;
},

markAsRead: function(obj) {
	var output = new Object();

	for (var i = 0; i < this.social.length; i++) {
		if (obj.name != undefined && this.social[i].name == obj.name &&
			obj.index >= 0 && obj.index < this.social[i].mail.length) {
			this.social[i].mail[obj.index].read = true;
			if (this.social[i].mail[obj.index].s)
				output.s = this.social[i].mail[obj.index].s;
			break;
		}
	}
	return output;
},

getDialogSeq: function(obj, victory_cb)
{
	var output = new Object();
	console.log(obj);

	if (obj.name === undefined) {
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
				if (this.social[i].exchange[this.social[i].idx].s) {
					output.s = this.social[i].exchange[this.social[i].idx].s;
					if (this.social[i].exchange[this.social[i].idx].w)
						victory_cb();
				}
				this.social[i].active = true;
			} else {
				var newIdx;
				if (obj.r !== undefined) {
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
				if (this.social[i].exchange[this.social[i].idx].s) {
					output.s = this.social[i].exchange[this.social[i].idx].s;
					if (this.social[i].exchange[this.social[i].idx].w)
						victory_cb();
				}
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
