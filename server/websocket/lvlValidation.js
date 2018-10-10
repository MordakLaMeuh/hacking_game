module.exports =
{
/*
 * Get lvlData (availableCmd + winningCondition)
 */
getLvlData: function(levelFile)
{
	const fs = require('fs');
	var lvlData = fs.readFileSync(levelFile);
	lvlData = JSON.parse(lvlData);
	return (lvlData);
},

/*
 * check command
 */
checkCommand: function(cmdList, usrCmd)
{
	return true; // TODO
	for (var i = 0; i < cmdList.length; i++)
	{
		if (cmdList[i][0] == usrCmd)
			return (true);
	}
	return (false);
},

/*
 * Check victory
 */
checkVictory: function(winningCondition, usrCondition)
{
	for (var i = 0; i < winningCondition.length; i++)
	{
		if (winningCondition[i] != usrCondition[i])
			return (false);
	}
	return (true);
}
}
