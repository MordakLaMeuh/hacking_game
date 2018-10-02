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
** Constructor File
*/
function File(parent, name, children, isDir)
{
    this.parent = parent;
    this.name = name;
    this.children = children;
    this.isDir = isDir;
    if (this.parent)
        this.parent.children.push(this);
}

/*
 * Function displayArgs
 */
function ls2(children, args)
{
    var i = 0;
    var str = "ls " + args.join(' ') + "\n";

    while (i < children.length)
    {
        str += children[i].name;
        i++;
        if (i < children.length)
            str += "\n";
    }
    return (str);
}

/*
 * Function createFileSystem
 */
function createFileSystem()
{
    var root = new File(null, "/", [], true);
    new File(root, "Missions", [], true);
    new File(root, "Other", [], true);
    new File(root, "readme.txt", [], false);
    new File(root.children[0], "mission.txt", [], false);
    new File(root.children[0], "mission2.txt", [], false);
    new File(root.children[1], "other.txt", [], false);
    return (root);
}

/*
 * Function displayArgs
 */
function displayArgs(args)
{
	var i = 0;

	while (i < args.length) {
		console.log("arg number " + i + " is : " + args[i]);
		i++;
	}
}

/*
 * Function getIndex
 * Similar to array.indexOf
 */
function getIndex(children, name)
{
    var i = 0;
    while (i < children.length)
    {
        if (children[i].name == name)
            return (i);
        i++;
    }
    return (-1);
}

/*
 * Function cd
 */
function cd(curDir, args)
{
    var retArray = [curDir];

    if (args.length != 1)
        retArray.push("cd\nUsage cd PATH\n");
    if (args[0] == "..")
    {
        if (curDir.parent)
            retArray[0] = curDir.parent;
        retArray.push("cd " + args[0] + "\n");
    }
    else
    {
        var index = getIndex(curDir.children, args[0]);
        if (index == -1)
            retArray.push("cd: " + args[0] + ": No such file or directory\n");
        else if (curDir.children[index].isDir == false)
            retArray.push("cd: " + args[0] + ": Not a directory\n");
        else
        {
            retArray.push("cd " + args[0] + "\n");
            retArray[0] = curDir.children[index];
        }
    }
    return (retArray);
}

/*
 * Function cat
 */
function cat(args)
{
	var str = "";

	displayArgs(args);

	switch (args.length) {
	case 0:
		str += "cat\nUsage : cat FILE";
		break;
	case 1:
		if (args[0] == "mission.txt")
			str += "cat mission.txt\nYour mission is to find the identity of Mr. X. Good luck."
		else
			str += "cat: " + args[0] + ": No such file or directory";
		break;
	default:
		console.log("cat with more than 2 args");
		str += "cat " + args.join(' ');
		break;
	}
	return str;
}

/*
 * Function ls
 */
function ls(args)
{
	var str = "";

	displayArgs(args);

	switch (args.length) {
	case 0:
		console.log("ls without args : ls");
		str += "ls\nmission.txt - 1ko";
		break;
	case 1:
		if (args[0].charAt(0) == '-') {
			console.log("ls with one option, but without file : ls " + args[0]);
			if (args[0] == "-a")
				str += "ls " + args[0] + "\nmission.txt - 1ko\n.hidden_file.txt - 2ko";
			else
				str += "ls: invalid option -- " + "\'" + args[0] + "\'";
		} else if (args[0] == "mission.txt") {
			console.log("ls with one file : ls " + args[0]);
			str += "ls " + args[0] + "\nmission.txt - 1ko";
		} else {
			console.log("ls with one file : ls " + args[0]);
			str += "ls " + args[0] + "\nls : cannot access \'" + args[0] + "\': No such file or directory";
		}
		break;
	default :
		console.log("ls with more than 2 args");
		str += "ls " + args.join(' ');
		break;
	}
	return str;
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
    var curDir = createFileSystem();

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
			    else if (parseInt(str[1]) < 0)
                    str = "Number must be positive value"
                else
    				str = str_rot(parseInt(str[1]), str[2]);
				break;
			case "ls":
				str = ls(str.slice(1, str.length));
				break;
			case "help":
				str = "help\n ls : list all files on the current folder\n cat filename : display content of file\n";
				break;
			case "cat":
				str = cat(str.slice(1, str.length));
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
                var retArray = cd(curDir, str.slice(1, str.length));
                curDir = retArray[0];
                str = retArray[1];
                break;
            case "ls2":
            console.log("cur = " + curDir.name);
                str = ls2(curDir.children, str.slice(1, str.length));
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
