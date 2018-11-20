
var method = Social.prototype;

function Social() {
	console.info("SERVER Social constructor called");
	this.social = new Array();
}

/*
 * Add new social entries and return new png name with exchange feature
 */
method.addEntries = function(obj, sendCb)
{
	let output = new Array();
	let self = this;

	obj.forEach(function(newContact) {
		let isAlreadyKnew = false;
		/*
		 * Check is contact already exist
		 */
		self.social.forEach(function(contact) {
			if (newContact.name == contact.name) {
				isAlreadyKnew = true;
				/*
				 * Search for new dialog sequence and if, replace it
				 */
				if (newContact.exchange !== undefined) {
					contact.exchange = newContact.exchange;
					contact.active = false;
					contact.idx = 0;
					/*
					 * Inform social panel about changes
					 */
					output.push(contact.name);
				}
				/*
				 * Search for new emails
				 */
				if (newContact.mail !== undefined) {
					newContact.mail.forEach(function(email) {
						email.read = false;
						contact.mail.push(email);
						/*
						 * Inform mail panel about changes
						 */
						sendCb({"mail" : {"name": contact.name, "content": [email], "update": true}});
					});
				}
			}
		});
		if (isAlreadyKnew == false) {
			/*
			 * Routines for a new contact
			 */
			self.social.push(newContact);
			let contact = (self.social[self.social.length - 1]);

			if (contact.exchange !== undefined)
				output.push(contact.name);
			contact.active = false;
			contact.idx = 0;

			if (contact.mail !== undefined) {
				contact.mail.forEach(function(email) {
					email.read = false;
				});
			}
		}
	 });
	 return output;
}

method.sendMail = function(obj) {

	for (let i = 0; i < this.social.length; i++) {
		if (this.social[i].name == obj.name
			&& this.social[i].password !== undefined
			&& this.social[i].password == obj.password
			&& this.social[i].mail !== undefined) {
			return this.social[i].mail;
		}
	}
	console.log("Cannot access mailbox for " + obj.name);
	return undefined;
}

method.markAsRead = function(obj, victory_cb) {
	let output = null;

	if (obj.name === undefined) {
		console.warn("undefined name");
		return;
	}

	this.social.forEach(function(contact) {
		if (obj.name == contact.name) {
			let idx = obj.index;
			if (idx >= 0 && idx < contact.mail.length) {
				if (contact.mail[idx].read == false) {
					if (contact.mail[idx].s !== undefined)
						output = contact.mail[idx].s;
					if (contact.mail[idx].w !== undefined)
						victory_cb();
				}
				contact.mail[idx].read = true;
			} else {
				console.warn("unexpected mail index");
			}
		}
	});
	return output;
}

method.getDialogSeq = function(obj, victory_cb)
{
	let output = new Object();
	console.log(obj);

	if (obj.name === undefined) {
		console.warn("undefined name field")
		return undefined;
	}
	let i = 0;
	for (i = 0; i < this.social.length; i++) {
		if (this.social[i].name == obj.name) {
			output.name = obj.name;
			if (this.social[i].active == false) {
				output.q = this.social[i].exchange[this.social[i].idx].q;
				output.r = this.social[i].exchange[this.social[i].idx].r;
				if (this.social[i].exchange[this.social[i].idx].s) {
					output.s = this.social[i].exchange[this.social[i].idx].s;
				}
				this.social[i].active = true;
			} else {
				let newIdx;
				if (obj.r !== undefined) {
					if (obj.r < 0 || obj.r >= this.social[i].exchange[this.social[i].idx].r.length) {
						console.warn("bad index: " + obj.r);
						return undefined;
					}
					newIdx = this.social[i].exchange[this.social[i].idx].i[obj.r];
				} else {
					if (this.social[i].exchange[this.social[i].idx].r.length == 0 &&
							this.social[i].exchange[this.social[i].idx].i != undefined) {
						newIdx = this.social[i].exchange[this.social[i].idx].i[0];
					} else {
						console.log("already activated");
						return undefined;
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
		return undefined;
	}
	console.log(output);
	return output;
}
