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
 * Function cat
 */
function cat(args)
{
	var str = "";

	displayArgs(args);

	switch (args.length) {
	case 0:
		str += "Usage : cat FILE";
		break;
	case 1:
		if (args[0] == "mission.txt")
			str += "Your mission is to find the identity of Mr. X. Good luck."
		else
			str += "cat '" + args[0] + "': No such file or directory";
		break;
	default:
		console.log("cat with more than 2 args");
		str += "too much arguments";
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
		str += "mission.txt - 1ko";
		break;
	case 1:
		if (args[0].charAt(0) == '-') {
			console.log("ls with one option, but without file : ls " + args[0]);
			if (args[0] == "-a")
				str += "mission.txt - 1ko\n.hidden_file.txt - 2ko";
			else
				str += "ls : invalid option -- " + "\'" + args[0] + "\'";
		} else if (args[0] == "mission.txt") {
			console.log("ls with one file : ls " + args[0]);
			str += "mission.txt - 1ko";
		} else {
			console.log("ls with one file : ls " + args[0]);
			str += "ls : cannot access \'" + args[0] + "\': No such file or directory";
		}
		break;
	default :
		console.log("ls with more than 2 args");
		str += "too much arguments";
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
	var newClient = false;

	/*
	 * Event on input client message
	 */
	client.on("message", function (str)
	{
		console.log("incoming message: " + str);

		var json_msg;
		var input;
		var output;

		try {
			json_msg = JSON.parse(str);
		} catch (e) {
		    console.log("not a JSON");
		    send(client, JSON.stringify({"error":"Internal server error"}));
		    return ;
		}

		if (newClient == true) {
			clientSocket.push(client);
			clientUserList.push(str);
			newClient = false;
		}

		console.log("input command: " + json_msg.command);
		input = json_msg.command;

		input = input.replace(/^\s+|\s+$/gm,'');
		input = input.replace(/  +/g, ' ');
		input = input.split(' ');
		switch (input[0]) {
		case "rot":
		    if (!input[1] || !input[2] || isNaN(parseInt(input[1])) === true)
		        output = "Usage : rot number word"
            else
				output = str_rot(parseInt(input[1]), input[2]);
			break;
		case "ls":
			output = ls(input.slice(1, input.length));
			break;
		case "help":
			output = " ls : list all files on the current folder\n cat filename : display content of file\n";
			break;
		case "cat":
			output = cat(input.slice(1, input.length));
			break;
		case "roll":
			var nbr = Math.floor(math.random() * (6 - 0));
			output = "You throw a six faces dice and you ger a " + nbr;
			break;
		default :
			output = "unknown command !";
			break;
		}
		send(client, JSON.stringify({"result":output}));
	})

	client.on("close", function()
	{
		console.log('__DECONNEXION DETECTED__');
	})
});
