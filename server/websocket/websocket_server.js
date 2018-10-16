/*
 * Require the main librairy WebSocket
 */
var WebSocketServer = require("ws").Server;
var port = 8081;

var math = require('math');
var termfunc = require('./termfunc.js');
var social = require('./social.js');
var lvlValidation = require('./lvlValidation.js');

/*
 * Opening socket websocket server
 */
var ws = new WebSocketServer({port: port});

/*
 * That library tell us the IP of the server
 */
var ip = require('ip');

console.log(new Date() + '\nhacking_game server running on ' + ip.address() + ':' + port);

var send = function(socket, msg, status)
{
	socket.send(msg, function ack(error) {
		if (error) {
			console.log(". ERR status -> " + error);
		}
	});
}

/*
 * Event launched when client connexion. TCP mode. SYN ---> SYN ACK -----> ACK
 */
ws.on('connection', function (client, req)
{
	console.log('__NEW CONNEXION__ from ' + req.connection.remoteAddress);
	var logged = false;
	var ssh_request = false;
	var ssh_active = false;

	var files = termfunc.createFileSystem("generateVFS.csv");
	var filesSSH = termfunc.createFileSystem("molang.csv");
	var root = termfunc.getFile(files, "/");
	var curDir = root;
	var originCurDir; // for ssh

	var lvlData = lvlValidation.getLvlData("./levels.json");
	var curLvl = 0;
	var cmdList = lvlData[curLvl].cmdList;
	var winningCondition = lvlData[curLvl].winningCondition;
	social.constructor();

	send(client, JSON.stringify({
		"socialContacts":social.addEntries(lvlData[curLvl].social)
	}));
	console.log(social);

	/*
	 * Event on input client message
	 */
	client.on("message", function (str)
	{
		console.log("incoming message: " + str);
		var json_msg;
		try {
			json_msg = JSON.parse(str);
		} catch (e) {
			console.log("not a JSON");
			send(client, JSON.stringify({"error":"Internal server error"}));
			return ;
		}
		console.log(json_msg);

		var victoryRoutine = function(title)
		{
			curLvl++;
			if (curLvl < lvlData.length)
			{
				termfunc.updateFileSystem(files, lvlData[curLvl].updateFiles);
				cmdList = lvlData[curLvl].cmdList;
				winningCondition = lvlData[curLvl].winningCondition;
				console.log("NEW LEVEL LOADED");
				send(client, JSON.stringify({
					"diary": ["Congratulations, you win !", "you reach level " + (curLvl + 1) + " now."],
					"socialContacts": social.addEntries(lvlData[curLvl].social)}));
			} else {
				console.log("GAME FINISHED !");
			}
			return ;
		}

		if (json_msg.social !== undefined) {
			send(client, JSON.stringify({"social": social.getDialogSeq(json_msg.social, victoryRoutine)}));
			return;
		}

		if (json_msg.mail != undefined) {
			if (json_msg.mail.password !== undefined)
			{
				json_msg.mail.content = social.sendMail(json_msg.mail);
				console.log(json_msg.mail.content);
				send(client, JSON.stringify({json_msg}));
			}
			if (json_msg.mail.index !== undefined)
			{
				console.log("MAIL LU");
				send(client, JSON.stringify({"mail": social.markAsRead(json_msg.mail)}));
			}
			return;
		}

		if (logged == false) {
			if (json_msg.login == "root" && json_msg.password == "root") {
				var obj = new Object();
				var obj_mail = new Object();
				obj.auth = 1;
				obj.directory = "/";
				obj.login = "root";
				obj.server = "hacking_game";
				obj_mail.name = "root";
				obj_mail.password = "root";
				obj_mail.content = social.sendMail(obj_mail);
				send(client, JSON.stringify({
					"tty": obj,
					"mail": obj_mail
				}));
				logged = true;
				console.log("ON EST CONNECTE");
			} else {
				var obj = new Object();
				obj.auth = 0;
				send(client, JSON.stringify({"tty": obj}));
			}
			return ;
		}

		if (ssh_request == true) {
			ssh_request = false;
			if (json_msg.login == "molang" && json_msg.password == "molang") {
				root = termfunc.getFile(filesSSH, "/");
				originCurDir = curDir;
				curDir = root;
				ssh_active = true;
				var obj = new Object();
				obj.string = "SSH Connexion successful.";
				obj.directory = "/";
				obj.login = "molang";
				obj.server = "molang";
				send(client, JSON.stringify({
					"tty": obj
				}));
			} else {
				var obj = new Object();
				obj.string = "SSH Connexion failed.";
				send(client, JSON.stringify({"tty": obj}));
			}
			return;
		}

		if (json_msg.command === undefined) {
			console.log("JSON: no command field");
			send(client, JSON.stringify({"error": "Internal server error"}));
			return ;
		}

		var newDirectory;
		var input;
		var output;

		input = json_msg.command;

		input = input.replace(/^\s+|\s+$/gm,'');
		input = input.replace(/  +/g, ' ');
		input = input.split(' ');

		if (lvlValidation.checkCommand(cmdList, input[0]) == false)
		{
			var obj = new Object();
			obj.string = "unknown command !";
			send(client, JSON.stringify({"tty": obj}));
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
			var nbr = Math.floor((math.random() * 6 )) + 1;
			output = "You throw a six faces dice and you get a " + nbr;
			break;
		case "cd":
			var retArray = termfunc.cd(root, curDir, input.slice(1, input.length));
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
			send(client, JSON.stringify({"tty": {"auth_ssh": "1"}}));
			return;
			break;
		case "exit":
			if (ssh_active == true) {
					ssh_active = false;
					root = termfunc.getFile(files, "/");
					curDir = originCurDir;
					newDirectory = termfunc.pwd(curDir);
					var obj = new Object();
					obj.string = "SSH sucessfully exited.";
					obj.directory = termfunc.pwd(curDir);
					obj.name = "root";
					obj.server = "hacking_game";
					send(client, JSON.stringify({
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

		var obj = new Object();
		obj.string = (output) ? output : undefined;
		obj.directory = (newDirectory) ? newDirectory : undefined;
		send(client, JSON.stringify({
			"tty": obj
		}));
	})

	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
	})
});
