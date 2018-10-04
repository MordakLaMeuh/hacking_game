/*
 * Require the main librairy WebSocket
 */
var WebSocketServer = require("ws").Server;
var port = 8081;

var math = require('math');

/*
 * Rot any nmmber : string rot(nb, str)
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

/*
 * Filter int number before parseInt to avoid 42toto to be considered like 42
 */

filterInt = function (value) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value);
	return NaN;
}

/*
 * Function getFile
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
		return ([curDir, "Usage : cd PATH"]);
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
				return ([curDir, "cd: " + args[0] + ": No such file or directory"]);
			else if (tmpDir.isDir == false)
				return ([curDir, "cd: " + args[0] + ": Not a directory"]);
		}
		++i;
	}
	return ([tmpDir, "switching to " + args[0] + " directory"]);
}

/*
 * Function getLsContent
 */
function getLsContent(children, args, hidden)
{
	var i = 0;
	var str = "";

	while (i < children.length)
	{
		if (children[i].name[0] != "." || hidden == true)
		{
			str += children[i].name;
			i++;
			if (i < children.length)
				str += "<br>";
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
	return ("Usage : ls OPTION");
}

/*
 * Function cat
 */
function cat(curDir, args)
{
	if (args.length != 1)
		return ("Usage : cat FILE");
	curDir = getFile(curDir.children, args[0]);
	if (curDir == null)
		return ("cat: " + args[0] + ": No such file or directory");
	if (curDir.isDir == true)
		return ("cat: " + args[0] + ": Is a directory");
	return (curDir.content);
}

/*
 * Function pwd
 */
function pwd(curDir)
{
	var pwd = curDir.name;
	while (curDir.parent)
	{
		pwd = curDir.parent.name + pwd;
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
	var root = createFileSystem("generateVFS.csv");
	var curDir = root;

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
		switch (input[0]) {
		case "rot":
			if (!input[1] || !input[2] || isNaN(parseInt(input[1])) === true)
				output = "Usage : rot number word"
			else if (parseInt(input[1]) <= 0)
				output = "Number must be positive"
			else
				output = str_rot(parseInt(input[1]), input[2]);
			break;
		case "ls":
			output = ls(curDir, input.slice(1, input.length));
			break;
		case "help":
			output = " ls : list all files on the current folder<br> cat filename : display content of file";
			break;
		case "cat":
			output = cat(curDir, input.slice(1, input.length));
			break;
		case "roll":
			var nbr = Math.floor(math.random() * (6 - 0));
			output = "You throw a six faces dice and you ger a " + nbr;
			break;
		case "cd":
			var retArray = cd(root, curDir, input.slice(1, input.length));
			curDir = retArray[0];
			output = retArray[1];
			break;
		case "pwd":
			output = pwd(curDir);
			break;
		default :
			output = "unknown command !";
			break;
		}
		send(client, JSON.stringify({"string":output}));
	})

	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
	})
});
