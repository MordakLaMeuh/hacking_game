module.exports =
{
/*
 * Get lvlData (availableCmd + winningCondition)
 */
getLvlData: function(levelFile)
{
	const fs = require('fs');
	var lvlData = fs.readFileSync(levelFile);
	console.log("levelData = " + lvlData);
	lvlData = JSON.parse(lvlData);
	console.log("levelData = " + lvlData.availableCmd);
	return (lvlData);
},

/*
 * check command
 */
checkCommand: function(cmdList, usrCmd)
{
	for (var i = 0; i < cmdList.length; ++i)
	{
		if (cmdList[i].constructor === Array)
		{
			if (cmdList[i][0] == usrCmd)
				return (true);
		}
		else if (cmdList[i] == usrCmd)
			return (true);
	}
	return (false);
},

/*
 * Check victory
 */
checkVictory: function(winningCondition, usrCmd, path)
{
	if (usrCmd == winningCondition[0] && path == winningCondition[1])
		return (true);
	return (false);
}
}
