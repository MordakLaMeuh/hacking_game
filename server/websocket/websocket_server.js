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
 * That librairy tell us the IP of the server
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
	social.addEntries(lvlData[curLvl].social);
	console.log(social);
	social.displayObj();

	send(client, JSON.stringify({
		"socialContacts":social.createContactList()
	}));

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

		if (json_msg.social) {
			send(client, JSON.stringify({"social": social.getDialogSeq(json_msg.social)}))
			return;
		}

		if (json_msg.mail) {
			console.log("J'AI RECU UN E-MAIL");
			sendMail(json_msg.login, json_msg.password);
		}

		if (logged == false) {
			if (json_msg.login == "root" && json_msg.password == "root") {
				var obj = new Object();
				obj.auth = 1;
				obj.directory = "/";
				obj.login = "root";
				obj.server = "hacking_game";
				send(client, JSON.stringify({
					"tty": obj
				}));
				logged = true;
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


		var newDirectory;
		console.log("input command: " + json_msg.command);

		var input;
		var output;
		input = json_msg.command;
		if (!input) {
			console.log("JSON: no input field");
			send(client, JSON.stringify({"error":"Internal server error"}));
			return ;
		}

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
			var obj = new Object();
			obj.auth_ssh = 1;
			send(client, JSON.stringify({"tty": obj}));
			return;
			break;
		case "exit":
			if(ssh_active == true) {
					ssh_active = false;
					root = termfunc.getFile(files, "/");
					curDir = originCurDir;
					newDirectory = termfunc.pwd(curDir);
					var obj = new Object();
					obj.string = "SSH sucessfully exited.";
					obj.directory = termfunc.pwd(curDir);
					obj.login = "root";
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
		{
			curLvl++;
			if (curLvl < lvlData.length)
			{
				termfunc.updateFileSystem(files, lvlData[curLvl].updateFiles);
				cmdList = lvlData[curLvl].cmdList;
				winningCondition = lvlData[curLvl].winningCondition;
				social.addEntries(lvlData[curLvl].social);
				console.log(social);
				console.log("NEW LEVEL LOADED");
				var obj = new Object();
				obj.string = (output) ? output : undefined;
				obj.directory = (newDirectory) ? newDirectory : undefined;
				send(client, JSON.stringify({
					"tty": obj,
					"diary": ["Congratulations, you win !", "you reach level " + (curLvl + 1) + " now."],
					"socialContacts": social.createContactList()}));
			} else {
				console.log("GAME FINISHED !");
			}
		} else {
			var obj = new Object();
			obj.string = (output) ? output : undefined;
			obj.directory = (newDirectory) ? newDirectory : undefined;
			send(client, JSON.stringify({
				"tty": obj}));
		}
	})

	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
	})
});
