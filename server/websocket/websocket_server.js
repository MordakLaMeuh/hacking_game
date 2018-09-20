/*
 * Necessite la librairie principale WebSocket
 */
var WebSocketServer = require("ws").Server;
var port = 8081;

var math = require('math');

/*
 * Création et ouverture du socket server
 */
var ws = new WebSocketServer({port: port});
/*
 * Librairie indiquant l'IP sur lequel tourne le serveur
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
    socket.send(msg, function ack(error)
    {
        console.log(status);
        if (error)
        {
            console.log(". ERR status -> " + error);
            for (var k = 0; k < clientSocket.length; k++)
            {
                if (clientSocket[k] == socket)
                {
                    clientSocket.splice(k, 1);
                    clientUserList.splice(k, 1);
                    break;
                }
            }
        }
    });
}

/*
 * Event lorsqu'un client se connecte. mode TCP. SYN ---> SYN ACK -----> ACK
*/
ws.on('connection', function (client, req)
{
    console.log('__NEW CONNEXION__ from ' + req.connection.remoteAddress);
    var newClient = true;

    /*
     * Event réception d'un message du client
    */
    client.on("message", function (str) {
        console.log(str);

        if (newClient == true)
        {
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
        }
        else
        {
            switch (str)
            {
              case "ls":
                  str = "ls\nmission.txt - 1ko";
                  break;
              case "help":
                  str = "help\n ls : list all files on the current folder\n cat filename : display content of file\n";
                  break;
              case "cat mission.txt":
                  str = "cat mission.txt\nYour mission is to find the identity of Mr. X. Good luck.";
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
                case "":
                    return;
            }

            for (var i = 0; i < clientSocket.length; i++)
            {
                if (client == clientSocket[i])
                {
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
        for (var i = 0; i < clientSocket.length; i++)
        {
            if (client == clientSocket[i])
            {
                var oldUser = clientUserList[i];
                clientSocket.splice(i, 1);
                clientUserList.splice(i, 1);

                var msg = "► " + oldUser + " vient de se déconnecter !\n";
                pushHistory(msg);

                console.log(msg);

                for (var j = 0; j < clientSocket.length; j++)
                    send(clientSocket[j], msg ,"close " + clientUserList[j]);
                break;
            }
        }
    })
});
