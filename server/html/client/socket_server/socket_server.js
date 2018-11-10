'use strict';

var SOCKET_SERVER = function() {
	var client_callback;

	var curLvl;

	var logged;
	var ssh_request;
	var ssh_active;

	var files;
	var zeroSSH;
	var bigSSH;
	var lvlData;

	var root;
	var curDir;
	var originCurDir;

	var cmdList;
	var winningCondition;

	function getFile(filename) {
		let output;

		function getFileContent(filename) {
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					cb(this.responseText);
				}
			}
			xhttp.open("GET", filename, false);
			xhttp.send();
		};
		function cb(content) {
			output = content;
		}
		getFileContent(filename, cb);
		return output;
	}

	this.post = function(str) {
		console.log("post");
		console.log(str);

		console.log("incoming message: " + str);
		let json_msg;
		try {
			json_msg = JSON.parse(str);
		} catch (e) {
			console.log("not a JSON");
			send(JSON.stringify({"error": "bad json"}));
			client.close();
			return ;
		}
		console.log(json_msg);

		function victoryRoutine(title)
		{
			curLvl++;
			if (curLvl < lvlData.length)
			{
				termfunc.updateFileSystem(files, lvlData[curLvl].updateFiles);
				cmdList = lvlData[curLvl].cmdList;
				winningCondition = lvlData[curLvl].winningCondition;
				console.log("NEW LEVEL LOADED");
				send(JSON.stringify({
					"diary": ["Congratulations", "you reach level " + (curLvl + 1) + " now."],
					"socialContacts": social.addEntries(lvlData[curLvl].social)}));
			} else {
				console.log("GAME FINISHED !");
				send(JSON.stringify({
					"diary": ["Congratulations", "you win. The End...?"]}));
			}
			return ;
		}

		if (json_msg.social !== undefined) {
			send(JSON.stringify({"social": social.getDialogSeq(json_msg.social, victoryRoutine)}));
			return;
		}

		if (json_msg.mail !== undefined) {
			if (json_msg.mail.password !== undefined) {
				send(JSON.stringify({"mail" : {"name": json_msg.mail.name, "content": social.sendMail(json_msg.mail)}}));
			} if (json_msg.mail.index !== undefined) {
				let obj = social.markAsRead(json_msg.mail, victoryRoutine);
				if (obj != null) {
					send(JSON.stringify({"diary": obj}));
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
				send(JSON.stringify({
					"tty": obj,
					"mail": obj_mail
				}));
				logged = true;
			} else {
				let obj = new Object();
				obj.auth = 0;
				send(JSON.stringify({"tty": obj}));
			}
			return ;
		}

		if (ssh_request == true) {
			ssh_request = false;
			if (json_msg.login == "zero" && json_msg.password == "12122000") {
				root = termfunc.getFile(zeroSSH, "/");
				originCurDir = curDir;
				curDir = root;
				ssh_active = true;
				let obj = new Object();
				obj.string = "SSH Connexion successful.";
				obj.directory = "/";
				obj.login = "zero";
				obj.server = "12122000";
				send(JSON.stringify({
					"tty": obj
				}));
			}
			else if (json_msg.login == "big" && json_msg.password == "1947") {
				root = termfunc.getFile(bigSSH, "/");
				originCurDir = curDir;
				curDir = root;
				ssh_active = true;
				let obj = new Object();
				obj.string = "SSH Connexion successful.";
				obj.directory = "/";
				obj.login = "big";
				obj.server = "1947";
				send(JSON.stringify({
					"tty": obj
				}));
			} else {
				let obj = new Object();
				obj.string = "SSH Connexion failed.";
				send(JSON.stringify({"tty": obj}));
			}
			return;
		}

		if (json_msg.command === undefined) {
			console.log("JSON: no command field");
			send(JSON.stringify({"error": "Internal server error"}));
			return ;
		}

		let newDirectory;
		let input;
		let output;

		input = json_msg.command;

		input = input.replace(/^\s+|\s+$/gm,'');
		input = input.replace(/  +/g, ' ');
		input = input.split(' ');

		if (lvlValidation.checkCommand(cmdList, input[0]) == false)
		{
			let obj = new Object();
			obj.string = "unknown command !";
			send(JSON.stringify({"tty": obj}));
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
			let nbr = Math.floor((math.random() * 6 )) + 1;
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
		case "ssh":
			if (ssh_active == true) {
				output = "Already in ssh.";
				break;
			}
			ssh_request = true;
			send(JSON.stringify({"tty": {"auth_ssh": "1"}}));
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
					send(JSON.stringify({
						"tty": obj
					}));
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
		send(JSON.stringify({
			"tty": obj
		}));
	}

	this.bind = function(_client_callback) {
		console.info("binding server");
		client_callback = _client_callback;

		logged = false;
		ssh_request = false;
		ssh_active = false;

		let file;

		file = getFile("socket_server/worlds/tuto/ssh/tutoVFS.csv");
		files = termfunc.createFileSystem(file);
		if (files === undefined) {
			send(client, JSON.stringify({"error": "Internal server error"}));
			client.close();
			return;
		}

		file = getFile("socket_server/worlds/tuto/ssh/molang.csv");
		zeroSSH = termfunc.createFileSystem(file);
		if (zeroSSH === undefined) {
			send(client, JSON.stringify({"error": "Internal server error"}));
			client.close();
			return;
		}

		file = getFile("socket_server/worlds/tuto/ssh/big.csv");
		bigSSH = termfunc.createFileSystem(file);
		if (bigSSH === undefined) {
			send(client, JSON.stringify({"error": "Internal server error"}));
			client.close();
			return;
		}

		root = termfunc.getFile(files, "/");
		curDir = root;
		originCurDir; // for ssh

		file = getFile("socket_server/worlds/tuto/tuto.json");
		lvlData = lvlValidation.getLvlData(file);
		if (lvlData === undefined) {
			send(JSON.stringify({"error": "critical Internal server error"}));
			return;
		}

		curLvl = 0;
		cmdList = lvlData[curLvl].cmdList;
		winningCondition = lvlData[curLvl].winningCondition;

		send(JSON.stringify({
			"socialContacts":social.addEntries(lvlData[curLvl].social)
		}));
		console.log(social);
	}

	function send(content) {
		client_callback(content);
	}

	var social = new Social();
	var lvlValidation = new Lvl_validation();
	var termfunc = new Termfunc();
}
