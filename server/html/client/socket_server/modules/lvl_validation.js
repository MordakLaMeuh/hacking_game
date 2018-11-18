
var method = Lvl_validation.prototype;

function Lvl_validation() {
	console.info("SERVER Lvl_validation constructor called");
}
/*
 * Get lvlData (availableCmd + winningCondition)
 */
method.getLvlData = function(levelFile)
{
	return JSON.parse(levelFile);
}

/*
 * check command
 */
method.checkCommand = function(cmdList, usrCmd)
{
	for (let i = 0; i < cmdList.length; i++) {
		if (cmdList[i][0] == usrCmd)
			return true;
	}
	return false;
}

/*
 * Check victory
 */
method.checkVictory = function(winningCondition, usrCondition)
{
	for (let i = 0; i < winningCondition.length; i++) {
		if (winningCondition[i] != usrCondition[i])
			return false;
	}
	return true;
}
