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
 * Check victory
 */
checkVictory: function(winningCondition, usrCmd, path)
{
	if (usrCmd == winningCondition[0] && path == winningCondition[1])
		return (true);
	return (false);
}
}
