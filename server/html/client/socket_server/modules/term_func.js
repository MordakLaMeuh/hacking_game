
var method = Termfunc.prototype;

function Termfunc() {
	console.info("SERVER Termfunc constructor called");
}

/*
 * Rot any nmmber : string rot(nb, str)
 */
method.str_rot = function(num, str) {
	let alphabet = "abcdefghijklmnopqrstuvwxyz";
	let newStr = "";
	num = num % 26;
	for (let i = 0; i < str.length; i++) {
		let char = str[i],
		isUpper = (char === char.toUpperCase()) ? true : false;

		char = char.toLowerCase();

		if (alphabet.indexOf(char) > -1) {
			let newIndex = alphabet.indexOf(char) + num;
			if(newIndex < alphabet.length) {
				isUpper ? newStr += alphabet[newIndex].toUpperCase() : newStr += alphabet[newIndex];
			} else {
				let shiftedIndex = -(alphabet.length - newIndex);
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

method.filterInt = function(value) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value);
	return NaN;
}

/*
 * Function createFileSystem
 */
method.createFileSystem = function(file)
{
	let self = this;
	let files = [];

	file.forEach(function(entry) {
		console.log(entry);
		if (entry.length == 4)
			files.push(new File(entry[0], entry[1], entry[2], entry[3], files, self));
		else {
			console.warn("unexpected error while parsing csv");
		}
	});
	return files;
}

/*
 * Function cd
 */
method.cd = function(root, curDir, args)
{
	if (args.length != 1)
		return ([curDir, "Usage : cd PATH"]);
	let path = args[0].replace(/\/+/g, '/'), i = 0;
	let tmpDir;
	if (path.charAt(0) == '/') {
		tmpDir = root;
		if (path.length == 1)
			++i;
	} else {
		tmpDir = curDir;
	}
	path = path.replace(/^\/+|\/+$/gm,'');
	path = path.split('/')
	while (i < path.length) {
		if (path[i] == "..") {
			if (tmpDir.parent)
				tmpDir = tmpDir.parent;
		} else if (path[i] != ".") {
			tmpDir = this.getFile(tmpDir.children, path[i]);
			if (tmpDir == null)
				return ([null, "cd: " + args[0] + ": No such file or directory"]);
			else if (tmpDir.isDir == false)
				return ([null, "cd: " + args[0] + ": Not a directory"]);
		}
		++i;
	}
	return ([tmpDir, "switching to " + tmpDir.name + " directory"]);
}

/*
 * Function ls
 */
method.ls = function(curDir, args)
{
	if (args.length == 0)
		return getLsContent(curDir.children, args, false);
	else if (args.length == 1) {
		if (args[0] == "-a")
			return getLsContent(curDir.children, args, true);
		return "ls: invalid option -- " + "\'" + args[0] + "\'";
	}
	return "Usage : ls OPTION";
}

/*
 * Function help
 */
method.help = function(cmdList)
{
	let str = "";
	for (let i = 0; i < cmdList.length; i++) {
		if (cmdList[i].length == 2) {
			str += cmdList[i][1];
			if (i + 1 < cmdList.length)
				str += "<br>";
		}
	}
	return str;
}

/*
 * Function cat
 */
method.cat = function(curDir, args)
{
	if (args.length != 1)
		return "Usage : cat FILE";
	curDir = this.getFile(curDir.children, args[0]);
	if (curDir == null)
		return "cat: " + args[0] + ": No such file or directory";
	if (curDir.isDir == true)
		return "cat: " + args[0] + ": Is a directory";
	return curDir.content;
}

/*
 * Function pwd
 */
method.pwd = function(curDir)
{
	let pwd = curDir.name;

	while (curDir.parent) {
		if (curDir.parent.name == "/")
			pwd = curDir.parent.name + pwd;
		else
			pwd = curDir.parent.name + "/" + pwd;
		curDir = curDir.parent;
	}
	return pwd;
}

/*
 * Function getFile
 */
method.getFile = function(files, name)
{
	for (let i = 0; i < files.length; ++i) {
		if (files[i].name == name)
			return files[i];
	}
	return null;
}

method.updateFileSystem = function(files, updateFiles)
{
	let self = this;
	if (updateFiles === undefined) {
		return files;
	}
	updateFiles.forEach(function(update) {
		if (update[0] == "A")
			files = addFile([update[1], update[2], update[3], update[4]], files, self);
		else if (update[0] == "D")
			files = delFile(update[1], files);
		else if (update[0] == "M")
			moveFile([update[1], update[2]], files);
		else if (update[0] == "C")
			changeFile([update[1], update[2]], files);
	});
	return files;
}

method.hint = function(hintData)
{
	if (hintData !== undefined)
		return (hintData);
	else
		return ("No hint available.");
}

/*
 * Constructor File
 */
var File = function(name, parent, isDir, content, files, termfunc)
{
	this.name = name;
	this.parent = termfunc.getFile(files, parent);
	isDir == true ? this.isDir = true : this.isDir = false;
	content == null ? this.content = null : this.content = content;
	this.children = [];
	if (this.parent != null)
		this.parent.children.push(this);
}

/*
 * Function getLsContent
 */
function getLsContent(children, args, hidden)
{
	let i = 0;
	let str = "";

	while (i < children.length) {
		if (children[i].name[0] != "." || hidden == true) {
			if (children[i].name[0] == ".")
				str += "<span class='red'>" + children[i].name + "</span>";
			else if (children[i].isDir == true)
				str += "<span class='yellow'>" + children[i].name + "</span>";
			else
				str += children[i].name;
			i++;
			if (i < children.length)
				str += "<br>";
		} else {
			++i;
		}
	}
	return str;
}

function delFile(name, files)
{
	let file = termfunc.getFile(files, name);
	if (file) {
		if (file.parent) {
			let index = file.parent.children.indexOf(file);
			if (index != -1)
				file.parent.children.splice(index, 1);
		}
		file.parent = null;
		index = files.indexOf(file);
		if (index != -1)
			files.splice(index, 1);
	}
	return files;
}

function addFile(fileInfo, files, termfunc)
{
	files.push(new File(fileInfo[0], fileInfo[1], fileInfo[2], fileInfo[3], files, termfunc));
	return files;
}

function changeFile(fileInfo, files)
{
	let file = termfunc.getFile(files, fileInfo[0]);
	if (file != null)
		file.content = fileInfo[1];
}

function moveFile(fileInfo, files)
{
	let file = termfunc.getFile(files, fileInfo[0]);
	let parent = termfunc.getFile(files, fileInfo[1]);
	if (file) {
		if (file.parent) {
			let index = file.parent.children.indexOf(file);
			if (index != -1)
				file.parent.children.splice(index, 1);
		}
		file.parent = parent;
		if (file.parent)
			file.parent.children.push(file);
	}
}
