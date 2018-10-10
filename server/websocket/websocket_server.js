/*
 * Require the main librairy WebSocket
 */
var WebSocketServer = require("ws").Server;
var port = 8081;

var math = require('math');
var termfunc = require('./termfunc.js');
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

	var lvlData = lvlValidation.getLvlData("./levels.json");
	var curLvl = 0;
	var cmdList = lvlData[curLvl].cmdList;
	var winningCondition = lvlData[curLvl].winningCondition;

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

		if (logged == false) {
			if (json_msg.login == "root" && json_msg.password == "root") {
				send(client, JSON.stringify({"auth":1}));
				logged = true;
			} else {
				send(client, JSON.stringify({"auth":0}));
			}
			return ;
		}

		if (ssh_request == true) {
			ssh_request = false;
			if (json_msg.login == "molang" && json_msg.password == "molang") {
				root = termfunc.getFile(filesSSH, "/");
				curDir = root;
				ssh_active = true;
				send(client, JSON.stringify({"string": "SSH Connexion successful."}));

			} else {
				send(client, JSON.stringify({"string": "SSH Connexion failed."}));
			}
			return;
		}

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
			send(client, JSON.stringify({"string":"unknown command !"}));
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
			var nbr = Math.floor(math.random() * (6 - 0));
			output = "You throw a six faces dice and you ger a " + nbr;
			break;
		case "cd":
			var retArray = termfunc.cd(root, curDir, input.slice(1, input.length));
			curDir = retArray[0];
			output = retArray[1];
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
			send(client, JSON.stringify({"auth_ssh":1}));
			return;
			break;
		case "exit":
			if(ssh_active == true) {
					ssh_active = false;
					root = termfunc.getFile(files, "/");
					curDir = root;
					send(client, JSON.stringify({"string":"SSH sucessfully exited."}));
					return;
			}
			else {
					output = "No SSH connexion active.";
			}
			break;
		default :
			output = "unknown command !";
			break;
		}
		send(client, JSON.stringify({"string":output, "victory":
				(lvlValidation.checkVictory(winningCondition, [input.join(" "), termfunc.pwd(curDir)]) == true ?
					"Congratulations, you win !" : undefined)}));
		if (lvlValidation.checkVictory(winningCondition, [input.join(" "), termfunc.pwd(curDir)]))
		{
			if (++curLvl < lvlData.length)
			{
				termfunc.updateFileSystem(files, lvlData[curLvl].updateFiles);
				cmdList = lvlData[curLvl].cmdList;
				winningCondition = lvlData[curLvl].winningCondition;
				console.log("NEW LEVEL LOADED");
			}
			else
			{
					console.log("GAME FINISHED !");
			}
		}
	})



	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
	})
});
