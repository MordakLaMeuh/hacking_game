/*
 * Require the main librairy WebSocket
 */
var WebSocketServer = require("ws").Server;
var port = 8081;

var math = require('math');


/*
** Rot any nmmber : string rot(nb, str)
*/
function str_rot(num, str) {
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var newStr = "";
	num = num % 26;
	for (var i = 0; i < str.length; i++) {
		var char = str[i],
			isUpper = char === char.toUpperCase() ? true : false;

		char = char.toLowerCase();

		if (alphabet.indexOf(char) > -1) {
			var newIndex = alphabet.indexOf(char) + num;
			if(newIndex < alphabet.length) {
				isUpper ? newStr += alphabet[newIndex].toUpperCase() : newStr += alphabet[newIndex];
			} else {
				var shiftedIndex = -(alphabet.length - newIndex);
				isUpper ? newStr += alphabet[shiftedIndex].toUpperCase() : newStr += alphabet[shiftedIndex];
			}
		} else {
			newStr += char;
		}
	}
	return newStr;
}

/* Filter int number before parseInt to avoid 42toto to be considered like 42 */

filterInt = function (value) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value);
	return NaN;
}


/*
** Function getFile
*/
function getFile(files, name)
{
	for (var i = 0; i < files.length; ++i)
	{
		if (files[i].name == name)
			return (files[i]);
	}
	return (null);
}

/*
 * Constructor File
 */
function File(name, parent, isDir, content, files)
{
	this.name = name;
	this.parent = getFile(files, parent);
	isDir == "true" ? this.isDir = true : this.isDir = false;
	content == "null" ? this.content = null : this.content = content;
	this.children = [];
	if (this.parent)
		this.parent.children.push(this);
}

/*
 * Function createFileSystem
 */
function createFileSystem(file)
{
	const fs = require('fs');
	try
	{
		var data = fs.readFileSync(file, 'utf8');
	}
	catch(error)
	{
		console.log('Error:', error.stack);
	}
	var lines = data.split('\n'), files = [];
	for (var i = 1; i < lines.length; ++i)
	{
		var words = lines[i].split(',');
		if (words.length == 4)
			files.push(new File(words[0], words[1], words[2], words[3], files));
	}
	var root = getFile(files, "/");
	if (root)
		return (root);
	else
		throw ("Error: root is not found");
}

/*
 * Function cd
 */
function cd(root, curDir, args)
{
	if (args.length != 1)
		return ([curDir, "cd\nUsage cd PATH\n"]);
	var path = args[0].replace(/\/+/g, '/'), i = 0;
	if (path.charAt(0) == '/')
	{
		var tmpDir = root;
		if (path.length == 1)
			++i;
	}
	else
		var tmpDir = curDir;
	path = path.replace(/^\/+|\/+$/gm,'');
	path = path.split('/')
	while (i < path.length)
	{
		if (path[i] == "..")
		{
			if (tmpDir.parent)
				tmpDir = tmpDir.parent;
		}
		else if (path[i] != ".")
		{
			tmpDir = getFile(tmpDir.children, path[i]);
			if (tmpDir == null)
				return ([curDir, "cd: " + args[0] + ": No such file or directory\n"]);
			else if (tmpDir.isDir == false)
				return ([curDir, "cd: " + args[0] + ": Not a directory\n"]);
		}
		++i;
	}
	return ([tmpDir, "cd " + args[0] + "\n"]);
}

/*
 * Function getLsContent
 */
function getLsContent(children, args, hidden)
{
	var i = 0;
	var str = "ls " + args.join(' ') + "\n";

	while (i < children.length)
	{
		if (children[i].name[0] != "." || hidden == true)
		{
			str += children[i].name;
			i++;
			if (i < children.length)
				str += "\n";
		}
		else
			++i;
	}
	return (str);
}

/*
 * Function ls
 */
function ls(curDir, args)
{
	if (args.length == 0)
		return (getLsContent(curDir.children, args, false));
	if (args.length == 1)
	{
		if (args[0] == "-a")
			return (getLsContent(curDir.children, args, true))
		return ("ls: invalid option -- " + "\'" + args[0] + "\'");
	}
	return ("ls " + args.join(' ') + "\nUsage : ls OPTION\n");
}

/*
 * Function cat
 */
function cat(curDir, args)
{
	if (args.length != 1)
		return ("cat " + args.join(' ') + "\nUsage : cat FILE");
	curDir = getFile(curDir.children, args[0]);
	if (curDir == null)
		return ("cat: " + args[0] + ": No such file or directory");
	if (curDir.isDir == true)
		return ("cat: " + args[0] + ": Is a directory");
	return ("cat " + args.join(' ') + "\n" + curDir.content);
}

/*
 * Function pwd
 */
function pwd(curDir)
{
	var pwd = curDir.name;
	while (curDir.parent)
	{
		if (curDir.parent.name == "/")
			pwd = curDir.parent.name + pwd;
		else
			pwd = curDir.parent.name + "/" + pwd;
		curDir = curDir.parent;
	}
	return (pwd);
}

/*
 * Opening socket websocket server
 */
var ws = new WebSocketServer({port: port});

/*
 * That librairy tell us the IP of the server
 */
var ip = require('ip');

console.log(new Date() + '\nwebRTC server running on ' + ip.address() + ':' + port);

clientSocket = new Array();
clientUserList = new Array();

var history = new Array();

var pushHistory = function(msg)
{
	history.push(msg);
	if (history.length > 20)
		history.shift();
}

var send = function(socket, msg, status)
{
	socket.send(msg, function ack(error) {
		console.log(status);
		if (error) {
			console.log(". ERR status -> " + error);
			for (var k = 0; k < clientSocket.length; k++) {
				if (clientSocket[k] == socket) {
					clientSocket.splice(k, 1);
					clientUserList.splice(k, 1);
					break;
				}
			}
		}
	});
}

/*
 * Event launched when client connexion. TCP mode. SYN ---> SYN ACK -----> ACK
 */
ws.on('connection', function (client, req)
{
	console.log('__NEW CONNEXION__ from ' + req.connection.remoteAddress);
	var newClient = true;
	var root = createFileSystem("generateVFS.csv");
	var curDir = root;

	/*
	 * Event on input client message
	 */
	client.on("message", function (str)
	{
		console.log(str);
		if (newClient == true) {
			console.log('new client msg received -> ' + str);
			var msg = "► " + str + " vient de se connecter\n";
			pushHistory(msg);

			for (var j = 0; j < clientSocket.length; j++)
				send(clientSocket[j], msg, "send connected status to " + clientUserList[j]);

			send(client, history.join("") + "\
► Bienvenue " + str + "\n\
" + ((clientSocket.length == 0) ? "► Vous êtes le seul en ligne":"► " + ((clientSocket.length == 1) ? "Est" : "Sont" ) + " actuellement en ligne: " + clientUserList.join()) + "\n\
► Tapez help pour obtenir de l'aide.\n", "welcome msg for " + str + " at " + req.connection.remoteAddress);

			clientSocket.push(client);
			clientUserList.push(str);
			newClient = false;
		} else {
			str = str.replace(/^\s+|\s+$/gm,'');
			str = str.replace(/  +/g, ' ');
			str = str.split(' ');
			switch (str[0]) {
			case "rot":
				if (!str[1] || ! str[2] || isNaN(filterInt(str[1])) === true)
					str = "Usage : rot number word";
				else if (parseInt(str[1]) <= 0)
					str = "Number must be positive"
				else
					str = str_rot(parseInt(str[1]), str[2]);
				break;
			case "ls":
				str = ls(curDir, str.slice(1, str.length));
				break;
			case "help":
				str = "help\n ls : list all files on the current folder\n cat filename : display content of file\n";
				break;
			case "cat":
				str = cat(curDir, str.slice(1, str.length));
				break;
            case "pwd":
                str = str.join(' ') + "\n" + pwd(curDir);
                break;
			case "/status":
				send(client, "► " + ((clientSocket.length == 1) ? "Est":"Sont" ) + " actuellement en ligne: " + clientUserList.join() + "\n", "/status request");
				return;
			case "/roll":
				var i;
				for (i = 0; i < clientSocket.length; i++) {
					if (client == clientSocket[i])
						break;
				}

				var nbr = Math.floor(math.random() * (6 - 0));
				var msg = clientUserList[i] + " lance un dé de 6 faces et obtient " + nbr + ((nbr) ? " !\n" : " Mouhaha XD\n");
				pushHistory(msg);

				for (var j = 0; j < clientSocket.length; j++)
					send(clientSocket[j], msg, "send dice throw to " + clientUserList[j]);
				return;
			case "cd":
				var retArray = cd(root, curDir, str.slice(1, str.length));
				curDir = retArray[0];
				str = retArray[1];
				break;
			case "":
				return;
			default :
				str = str.join(' ');
				break;
			}

			for (var i = 0; i < clientSocket.length; i++) {
				if (client == clientSocket[i]) {
					console.log("message received from " + clientUserList[i] + ": " + str);
					var msg = clientUserList[i] + ": " + str + "\n";
					pushHistory(msg);
					for (var j = 0; j < clientSocket.length; j++)
						send(clientSocket[j], msg, "send msg to " + clientUserList[j]);
					break;
				}
			}
		}
	})

	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
		for (var i = 0; i < clientSocket.length; i++) {
			if (client == clientSocket[i]) {
				var oldUser = clientUserList[i];
				clientSocket.splice(i, 1);
				clientUserList.splice(i, 1);

				var msg = "► " + oldUser + " vient de se déconnecter !\n";
				pushHistory(msg);

				console.log(msg);

				for (var j = 0; j < clientSocket.length; j++)
					send(clientSocket[j], msg , "close " + clientUserList[j]);
				break;
			}
		}
	})
});
