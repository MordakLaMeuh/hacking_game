'use strict';

var SOCKET_SERVER = function() {
	var client_callback;

	var currentLevel;				// (int) Current Level of the player

	var lvlData;					// (JSON) Contain all the world data

	var logged;						// (bool) The player is logged or not
	var ssh_request;				// (bool) A SSH request in on pending
	var ssh_active;					// (bool) A SSH section is open

	var files;						// (obj) Contain the base directory tree
	var zeroSSH;					// (obj) Contain the zeroSSH directory tree
	var bigSSH;						// (obj) Contain the bigSSH direcotry tree

	var root;						// (obj) Contain the current root
	var curDir;						// (obj) Contain the current directory
	var originCurDir;				// (obj) Old current directory (for ssh exit)

	var cmdList;					// (obj) List of available commands
	var winningCondition;			// (obj) Winning Condition

	/*
	 * Triggered when the server reveived a message
	 */
	this.post = function(json_msg) {
		console.info("server received:");
		console.log(json_msg);

		function victoryRoutine(title)
		{
			currentLevel++;
			if (currentLevel < lvlData.length)
			{
				termfunc.updateFileSystem(files, lvlData[currentLevel].updateFiles);
				cmdList = lvlData[currentLevel].cmdList;
				winningCondition = lvlData[currentLevel].winningCondition;
				console.log("NEW LEVEL LOADED");
				send({
					"diary": ["Well done. New goal :", lvlData[currentLevel].goal],
					"socialContacts": social.addEntries(lvlData[currentLevel].social, send)});
			} else {
				console.log("GAME FINISHED !");
				send({"diary": ["Congratulations", "you win. The End...?"]});
				try {
					parent.postMessage("gameOver:1:100","*");
				} catch (e) {
					console.info("unable to post victory message via iframe: " + e);
				}
			}
		}

		if (json_msg.social !== undefined) {
			let obj = social.getDialogSeq(json_msg.social, victoryRoutine);
			if (obj !== undefined)
				send({"social": obj});
			return;
		}

		if (json_msg.mail !== undefined) {
			if (json_msg.mail.password !== undefined) {
				send({"mail" : {"name": json_msg.mail.name, "content": social.sendMail(json_msg.mail), "update":false}});
			} else if (json_msg.mail.index !== undefined) {
				let obj = social.markAsRead(json_msg.mail, victoryRoutine);
				if (obj != null) {
					send({"diary": obj});
				}
			}
			return;
		}

		if (logged == false) {
			if (json_msg.login == "root" && json_msg.password == "root") {
				let obj = new Object();
				let obj_mail = new Object();
				obj.auth = 1;
				obj.directory = "/";
				obj.login = "root";
				obj.server = "home";
				obj_mail.name = "root";
				obj_mail.password = "root";
				obj_mail.content = social.sendMail(obj_mail);
				obj_mail.update = false;
				send({
					"tty": obj,
					"mail": obj_mail
				});
				logged = true;
			} else {
				let obj = new Object();
				obj.auth = 0;
				send({"tty": obj});
			}
			return ;
		}

		function load_ssh_session(tree, directory, login, serverName) {
			root = termfunc.getFile(tree, directory);
			originCurDir = curDir;
			curDir = root;
			ssh_active = true;
			let obj = new Object();
			obj.string = "SSH Connexion successful.";
			obj.directory = directory;
			obj.login = login;
			obj.server = serverName;
			send({"tty": obj});
		}

		if (ssh_request == true) {
			ssh_request = false;
			if (json_msg.login == "42" && json_msg.password == "norminet") {
				load_ssh_session(zeroSSH, "/", "student", "42");
			} else if (json_msg.login == "big" && json_msg.password == "1947") {
				load_ssh_session(bigSSH, "/", "big", "bigCorp");
			} else {
				let obj = new Object();
				obj.string = "SSH Connexion failed.";
				send({"tty": obj});
			}
			return;
		}

		if (json_msg.command === undefined) {
			console.log("JSON: no command field");
			send({"error": "Internal server error"});
			return ;
		}

		let newDirectory;
		let input;
		let output;

		input = json_msg.command;

		input = input.replace(/^\s+|\s+$/gm,'');
		input = input.replace(/  +/g, ' ');
		input = input.split(' ');

		/*
		 * Jump hack
		 */
		if (input[0] == "jump") {
			function fakeVictoryRoutine() {}

			let targetLvl = input[1];
			send({"tty": {"string": "jump hack: from " + currentLevel + " to " + targetLvl}});
			for (let i = currentLevel; i < targetLvl && i < lvlData.length; i++) {
				for (let j = 0; j < social.social.length; j++) {
					/*
					 * Bypass All mail instances
					 */
					if (social.social[j].mail !== undefined) {
						let k = 0;
						social.social[j].mail.forEach(function(email) {
							let obj = new Object();
							obj.name = social.social[j].name;
							obj.index = k++;
							let output = social.markAsRead(obj, fakeVictoryRoutine);
							if (output != null) {
								send({"diary": output});
							}
						});
					}
					/*
					 * Bypass all social instances
					 */
					if (social.social[j].exchange !== undefined) {
						social.social[j].exchange.forEach(function(dialog) {
							if (dialog.s) {
								send({"diary": dialog.s});
								dialog.s = undefined;
							}
							dialog.w = undefined;
						});
					}
				}
				victoryRoutine();
				send({"tty": {"string": "jump hack: level " + i + " passed"}});
			}
			send({"tty": {"string": "jump hack: You hack the entire system"}});
			return;
		}

		if (lvlValidation.checkCommand(cmdList, input[0]) == false) {
			let obj = new Object();
			obj.string = "unknown command !";
			send({"tty": obj});
			return ;
		}

		switch (input[0]) {
		case "rot":
			if (!input[1] || !input[2] || isNaN(termfunc.filterInt(input[1])) === true)
				output = "Usage : rot number word"
			else if (parseInt(input[1]) <= 0)
				output = "Number must be positive"
			else
				output = termfunc.str_rot(parseInt(input[1]), input[2]);
			break;
		case "rotify":
			if (!input[1] || !input[2] || isNaN(termfunc.filterInt(input[1])) === true)
				output = "Usage : rotify number file"
			else if (parseInt(input[1]) <= 0)
				output = "Number must be positive"
			else
				output = termfunc.rotify(parseInt(input[1]), input[2], curDir);
			break;
		case "ls":
			output = termfunc.ls(curDir, input.slice(1, input.length));
			break;
		case "help":
			output = termfunc.help(cmdList);
			break;
		case "cat":
			output = termfunc.cat(curDir, input.slice(1, input.length));
			break;
		case "roll":
			let nbr = Math.floor((Math.random() * 6 )) + 1;
			output = "You throw a six faces dice and you get a " + nbr;
			break;
		case "cd":
			let retArray = termfunc.cd(root, curDir, input.slice(1, input.length));
			if (retArray[0] != null) {
				curDir = retArray[0];
				newDirectory = termfunc.pwd(curDir);
			} else {
				output = retArray[1];
			}
			break;
		case "pwd":
			output = termfunc.pwd(curDir);
			break;
		case "hint":
			output = termfunc.hint(lvlData[currentLevel].hint);
			break;
		case "whois": {
			if (input[1] == "5.5.5.5")
				output = "Name : BIG <br/> Type : Company <br/> Location : North America";
			else if (input[1] == "9.80.45.122")
				output = "Name : Jones <br/> Type : Individual <br/> Location : Brazil";
			else if (input[1] == "23.123.54.92")
				output = "Name : Ramirez <br/> Type : Individual <br/> Location : Germany";
			else
				output = "No result found."
			break;
		}
			case "ssh":
			if (ssh_active == true) {
				output = "Already in ssh.";
				break;
			}
			ssh_request = true;
			send({"tty": {"auth_ssh": "1"}});
			return;
			break;
		case "exit":
			if (ssh_active == true) {
					ssh_active = false;
					root = termfunc.getFile(files, "/");
					curDir = originCurDir;
					newDirectory = termfunc.pwd(curDir);
					let obj = new Object();
					obj.string = "SSH sucessfully exited.";
					obj.directory = termfunc.pwd(curDir);
					obj.login = "root";
					obj.server = "home";
					send({"tty": obj});
					return;
			} else {
					output = "No SSH connexion active.";
			}
			break;
		default :
			output = "unknown command !";
			break;
		}

		if (lvlValidation.checkVictory(winningCondition, [input.join(" "), termfunc.pwd(curDir)]))
			victoryRoutine();

		let obj = new Object();
		obj.string = (output) ? output : undefined;
		obj.directory = (newDirectory) ? newDirectory : undefined;
		send({"tty": obj});
	}

	/*
	 * When client is ready, initialize a connexion with the server
	 */
	this.bind = function(_client_callback) {
		console.info("binding server");
		client_callback = _client_callback;

		logged = false;
		ssh_request = false;
		ssh_active = false;

		files = termfunc.createFileSystem(home);
		if (files === undefined) {
			send({"error": "Internal server error"});
			return;
		}

		zeroSSH = termfunc.createFileSystem(ft);
		if (zeroSSH === undefined) {
			send({"error": "Internal server error"});
			return;
		}

		bigSSH = termfunc.createFileSystem(big);
		if (bigSSH === undefined) {
			send({"error": "Internal server error"});
			return;
		}

		root = termfunc.getFile(files, "/");
		curDir = root;
		originCurDir = curDir; // for ssh

		lvlData = world;
		if (lvlData === undefined) {
			send({"error": "critical Internal server error"});
			return;
		}

		currentLevel = 0;
		cmdList = lvlData[currentLevel].cmdList;
		winningCondition = lvlData[currentLevel].winningCondition;

		send({"socialContacts":social.addEntries(lvlData[currentLevel].social, send)});
		console.log(social);
	}

	/*
	 * Send message to client method
	 */
	function send(content) {
		console.info("server sending:");
		console.log(content);
		client_callback(content);
	}

	var social = new Social();
	var lvlValidation = new Lvl_validation();
	var termfunc = new Termfunc();
}
