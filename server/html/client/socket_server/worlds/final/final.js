var world =
[
	{
		"winningCondition":
		[],
		"hint": "Try talking with Admin",
		"goal": "Log in.",
		"cmdList":
		[
			["cat", "cat filename : display content of file"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"],
			["hint"],
			["whois"]
		],
		"social":
		[
			{
				"name": "root",
				"password": "root",
				"mail":
				[
					{
						"sender": "0",
						"from_to": "Admin 42",
						"title": "Welcome",
						"text": "Welcome to 42 ! We hope you'll enjoy staying with us. Are you born to hack ? Please visit our website for more info : www.42.fr"
					}
				]
			},
			{
				"name": "Admin",
				"password": "Admin",
				"exchange":
				[
					{
						"q":"Hey, it's been a long time. I changed your computer login and password to 'root'. Try to log in terminal.",
						"r":["Got it", "What next ?"],
						"i":["1", "1"]
					},
					{
						"q":"Talk to Marvin when you're done. he has something to tell you.",
						"r": ["Okay, thank you"],
						"i":["2"],
						"s": ["Credentials", "You can get access to your computer using root/root."],
						"w": "1"
					},
					{
						"q":"Good luck !",
						"r":[]
					}
				]
			}
		]
	},
	{
		"winningCondition":
		[
			"help"
		],
		"goal": "Display available commands in terminal.",
		"hint": "Type 'help' in terminal to display available commands.",
		"cmdList":
		[
			["cat","cat filename : display content of file"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"],
			["hint"]
		],
		"social":
		[
			{
				"name": "Marvin",
				"password": "toto",
				"exchange":
				[
					{
						"q":"Hey !",
						"r":["Hi, you want to tell me something?", "I heard you want to talk to me."],
						"i":["1", "1"]
					},
					{
						"q":"That's true but first, let's review the basics. The 'help' command display all available commands in terminal. Don't hesitate to use it when you're stuck.",
						"r": ["Got it"],
						"i":["2"]
					},
					{
						"q":"Really ? Let's try it.",
						"r":[]
					}
				]
			}
		]
	},
	{
		"winningCondition":
		[
			"ls"
		],
		"goal": "Display files in current directory.",
		"hint": "Type ls in terminal",
		"cmdList":
		[
			["cat","cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"],
			["hint"]
		],
		"social":
		[
			{
				"name": "Marvin",
				"exchange":
				[
					{
						"q": "Good ! One last thing : you can check your current goal in your Diary. If you're really stuck, type 'hint'. But don't overdo it !",
						"r": ["I understand."],
						"i": ["1"]
					},
					{
						"q": "Ok, now you're all set. I received an e-mail from 42, I copied the content in a file in your computer. Just go and read it.",
						"r": []
					}
				]
			}
		]
	},
	{
		"winningCondition":
		[
			"cat mission.txt",
			"/Missions"
		],
		"goal": "Locate and read Marvin's file.",
		"hint": "Try using cat to read a file.",
		"cmdList":
		[
			["cat","cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"],
			["hint"]
		],
		"social":
		[]
	},
	{
		"winningCondition":
		[
			"cat .mitchell.txt",
			"/.Students"
		],
		"goal": "Find information about the mysterious student.",
		"hint": "Use the browser to gather information about 42, then connect through ssh and look for hidden files.",
		"cmdList":
		[
			["cat","cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"]
		],
		"social":
		[]
	},
	{
		"winningCondition":
		["whois 5.5.5.5"],
		"goal": "Find information about Artie Mitchell's location.",
		"hint": "Try using whois in your terminal",
		"cmdList":
		[
			["cat","cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit : exit ssh session"],
			["whois", "whois ipaddress : give info on a ip address"],
			["hint"]
		],
		"social":
		[
			{
			"name": "Marvin",
			"password": "toto",
			"exchange":
				[
					{
						"q":"Did you see that ? He even beat you. This guy is awesome... What do you think ?",
						"r":["He's a genius", "He's a cheater"],
						"i":["1", "1"]
					},
					{
						"q":"Well, maybe you're right, You know what an ip is, right ?",
						"r": ["A what ?", "Yeah, sure"],
						"i":["2", "3"]
					},
					{
						"q":"No worries. I let you some doc on your PC. Everything you need is explained in there.",
						"r":[]
					},
					{
						"q":"Ok, then you can exit ssh and go back to your desktop. I left you some explanations there.",
						"r": []
					}
				]
			}
		],
		"updateFiles":
			[
				["A", "Doc", "/", true, null],
				["A", "ip.txt", "Doc", false, "An IP address, or simply an \"IP,\" is a unique address that identifies a device on the Internet or a local network. An IP address consist of four sets of numbers from 0 to 255, separated by three dots."],
				["A", "whois.txt", "Doc", false, "whois is a command that is used to find the details of a domain name or an IP address. Example : whois 8.8.8.8"]
			]
	},
	{
		"winningCondition":
		[""],
		"goal": "Access to MMC's CEO e-mail.",
		"hint": "Try looking at his facebook page to gather some hints",
		"social": [
			{
				"name": "aaron@mmc.com",
				"password": "12121980",
				"mail":
					[
						{
							"sender": "1",
							"from_to": "Lewis",
							"title": "Schedule",
							"text": "Hi Lewis, as you know, I'll be on holidays next week, I leave everything to you and Ellie :)"
						},
						{
							"sender": "0",
							"from_to": "RepairCenter",
							"title": "Your monthly invoice",
							"text": "Your address : 49 Summer Street</br></br>Dear Customer,</br> Thank you for using our services. Please find enclosed our monthly invoice.</br> Any problem ? Please call our emergency number: 888-3490.<br/></br>RepairCenter Miami<br/>RepairCenter : All your needs for computer maintenance all over the US !",
							"s": ["INFO", "You learnt valuable information about the MMC company."],
							"w":"1"
						},
						{
							"sender": "0",
							"from_to": "Ellie",
							"title": "Problem",
							"text": "I've been trying to get in contact with Artie for the last two weeks.</br>It seems he's locked himself in. It's gonna take some time to reach him..."
						}
					]
			},
			{
				"name": "Marvin",
				"password": "toto",
				"exchange":
					[
						{
							"q": "Good job ! Listen, I found something.",
							"r": ["Yeah ?"],
							"i": ["1"]
						},
						{
							"q": "I made some research about this company. The CEO's name is Aaron Mack. His mail address is aaron@mmc.com",
							"r": ["Thank you"],
							"i": ["2"]
						},
						{
							"q": "Wait, there's more. Here is his social media profile : www.fb.com/aaron , check it out.",
							"r": []
						}
					]
			}
		],
		"cmdList":
		[
			["cat", "cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit", "exit : exit ssh session"],
			["whois", "whois ipaddress : give info on a ip address"],
			["hint"]
		]
	},
	{
		"winningCondition": [""],
		"goal": "Gather information about MMC",
		"hint": "Try speaking to RepairCenter to get info on MMC.",
		"cmdList":
		[
			["cat", "cat filename : display content of file"],
			["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
			["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
			["pwd", "pwd : print name of current directory"],
			["roll"],
			["help"],
			["ssh", "ssh : connect to another computer"],
			["exit", "exit", "exit : exit ssh session"],
			["hint"]
		],
		"social":
		[
			{
				"name": "RepairCenter Miami",
				"exchange":
				[
					{
						"q": "RepairCenter Miami, Robin speaking.",
						"r": ["Hello, I'm your boss.", "Hello, my name is Taylor Green."],
						"i": ["1", "2"]
					},
					{
						"q": "What ? What are you talking about, my boss is right next to me. Stop your stupid pranks !",
						"r": [],
						"i":["0"]
					},
					{
						"q": "Sorry, who are you ?",
						"r": ["I'm from the invoice department at your New York Branch.", "I'm from the sales department at your London branch."],
						"i": ["3", "4"]
					},
					{
						"q": "I see, What can I do for you ?",
						"r": ["I cannot use my computer... I opened an e-mail attachment and everything crashed down."],
						"i": ["5", "6"]
					},
					{
						"q": "What ? We don't have any branches abroad. I'm calling the security.",
						"r": [],
						"i": ["0"]
					},
					{
						"q": "Oh yeah, I understand... Same thing happened to me last month. How can I help you Taylor ?",
						"r": ["Well I have a important woman on hold who ask information about a client. Name of the company is MMC"],
						"i": ["6"]
					},
					{
						"q": "Ok, you got the address ?",
						"r": ["445, Winter Lane", "49, Summer Street", "34, Spring Bld"],
						"i": ["8", "7", "8"],

					},
					{
						"q": "Let's see.... The client number is #1520. Have a good day !",
						"r": [],
						"s": ["NOTE", "MMC client number : #1520"],
						"w":"1",
					},
					{
						"q": "Sorry, this address doesn't match any client in our database. I can't help you.",
						"r": [],
						"i": ["0"]
					}
				]
			},
			{
				"name": "MMC Company",
				"exchange":
					[
						{
							"q": "MMC Company, Lewis speaking.",
							"r": ["Hello, I am Ed from RepairCenter.", "Hello, I'm Donald Trump and I need your ssh access. National security matter."],
							"i": ["1", "2"]
						},
						{
							"q": "Is something wrong ?",
							"r": ["We are just doing basic maintenance to give you a better service. I need access to your ssh to check something"],
							"i": ["3"]
						},
						{
							"q": "Very funny Aaron ! I have work to do, bye !",
							"r": []
						},
						{
							"q": "Yeah sure. Before anything, could you confirm with us our client number ?",
							"r": ["999 ?", 'Errr...777 ?', "Sorry, my dog ate my notebook"],
							"i":["4","4","4"]
						},
						{
							"q": "Without this number, I can't help you. Good bye.",
							"r": []
						}
					]
			}
		]
	},
	{
		"winningCondition": [""],
		"goal": "Get access to MMC ssh.",
		"hint": "Speak to MMC's employee Lewis.",
		"cmdList":
			[
				["cat", "cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit", "exit : exit ssh session"],
				["hint"]
			],
		"social":
			[
				{
					"name": "MMC Company",
					"exchange":
						[

							{
								"q": "MMC Company, Lewis speaking.",
								"r": ["Hello, I am Ed from RepairCenter.", "Hello, I'm Donald Trump and I need your ssh access. National security matter."],
								"i": ["1", "2"]
							},
							{
								"q": "Is something wrong ?",
								"r": ["We are just doing basic maintenance to give you a better service. I need access to your ssh to check something"],
								"i": ["3"]
							},
							{
								"q": "Very funny Aaron ! I have work to do, bye !",
								"r": [],
								"i":["0"]
							},
							{
								"q": "Yeah sure. Before anything, could you confirm with us our client number ?",
								"r": ["Sure ! It's #1520."],
								"i":["4"],
								"s": ["NOTE", "MMC Client ssh login : mmc / password : e2r9w"],
								"w":"1"
							},
							{
								"q": "All good. The ssh login is mmc and the password is e2r9w. Keep up the good work.",
								"r": []
							}
						]
				}
			]
	},
	{
		"winningCondition":
			[
				"cat article.txt",
				"/.Private"
			],
		"goal": "Find information",
		"hint": "Use the browser to gather information about 42.",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"]
			],
		"social":
			[
				{
				"name": "Unknown",
				"exchange":
					[

						{
							"q": "I know what you are doing. Stop it right now.",
							"r": ["Who are you ?"],
							"i": ["1"]
						},
						{
							"q": "Mind your own business.",
							"r": []
						}
					]
				}
			]
	},
	{
		"winningCondition":
			[
				"cat readme.txt",
			],
		"goal": "Open the documents you received from Marvin.",
		"hint": ".",
		"cmdList":
			[
				["cat", "cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"]
			],
		"social":
			[
				{
					"name": "Marvin",
					"exchange":
						[

							{
								"q": "Sorry but... WHAAAAAAAAAAAAAAAAT ?",
								"r": ["Yeah there's definitely something fishy...", "Maybe he came back from the dead to code. No wonders."],
								"i": ["1","1"]
							},
							{
								"q": "While you were busy, I peeked at Ellie's computer and find some really interesting stuff. I put everything on your computer. Some files might be crypted though.",
								"r": ["Any advice ?"],
								"i": ["2","2"]
							},
							{
								"q": "Ever heard of 'rot'?",
								"r": ["Like... dead people ?", "Yup"],
								"i": ["3","4"]
							},
							{
								"q": "Haha, no. 'rot' is a cipher where each letter is replaced with a letter corresponding to a certain number of letters shifted up or down in the alphabet.",
								"r": ["Sorry what ?", "I get it"],
								"i": ["5","4"]
							},
							{
								"q": "Good. I let you some doc on your computer in case you forget anyway. Good luck.",
								"r": []
							},
							{
								"q": "For example, a rot 1 would be that every letter is shifted by 1. A becomes B, B becomes C, etc. So what a rot 2 of abc would be ?",
								"r": ["cde", "xyz"],
								"i": ["4","6"]
							},
							{
								"q": "Well no, it was 'cde'... I let you more doc on your computer. I think you need to read it.",
								"r": []
							}
						]
				}
			],
		"updateFiles":
			[
				["A", "rot", "Programs", false, "Cannot open rot. Try using rot"],
				["A", "Marvin", "/", true, null],
				["A", "rot.txt", "Doc", "false", "Rotate (or rot) is a simple letter substitution cipher that replaces a letter with the n-th letter after it, in the alphabet.<br/> Example : rot 1 abc = bcd<br/>"],
				["A", "readme.txt", "Marvin", false, "I think I found a way to get to our guy. You need to solve the puzzle of the other file and submit your answer with unlock. It seems there are 3 locks."],
				["A", "thirteen.txt", "Marvin", false, "pna lbh chg gjb naq gjb gbtrgure ?"],
				["A", "password.txt", "Marvin", false, "_ _ _ _ _ _ _ _ "]
			]
	},
	{
		"winningCondition":
			[
				"unlock four"
			],
		"goal": "Unlock the first lock of Artie",
		"hint": "Use rot",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"],
				["hint"],
				["rot", "rot : replaces all letters of a file with the n-th letter after it"],
				["unlock", "unlock : try to break current lock with a password. Ex: unlock word"]
			],
		"social":
			[]
	},
	{
		"winningCondition":
			[
				"unlock genius"
			],
		"goal": "Display files in current directory.",
		"hint": "Type ls in terminal",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"],
				["hint"],
				["rot", "rot : replaces all letters of a file with the n-th letter after it"],
				["unlock", "unlock : try to break current lock with a password. Ex: unlock word"]
			],
		"social":
			[],
		"updateFiles":
			[
				["D", "thirteen.txt"],
				["A", "five.txt", "Marvin", false, "bzmhvidph idxfzg pmvidph npgapm"],
				["D", "password.txt"],
				["A", "password.txt", "Marvin", false, "_ n _ i _ _ t _"]
			]
	},
	{
		"winningCondition":
			[
				"unlock lane"
			],
		"goal": "Display files in current directory.",
		"hint": "Type ls in terminal",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"],
				["hint"],
				["rot", "rot : replaces all letters of a file with the n-th letter after it"],
				["unlock", "unlock : try to break current lock with a password. Ex: unlock word"]
			],
		"social":
			[
				{
					"name": "Unknown",
					"exchange":
						[

							{
								"q": "I told you to stop.",
								"r": ["I know you're a fake. What are you doing ?"],
								"i": ["1"]
							},
							{
								"q": "You've gone too far. I'll go and erase all your programs.",
								"r": []
							}
						]
				}
			],

		"updateFiles":
			[
				["D", "five.txt"],
				["A", "way.txt", "Marvin", false, "please take only seconds"],
				["D", "password.txt"],
				["A", "password.txt", "Marvin", false, "i n _ i _ i t _"]
			]
	},
	{
		"winningCondition":
			[
				"cat note.txt"
			],
		"goal": "Discover the truth.",
		"hint": "ssh to artie",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"],
				["hint"],
				["rot", "rot : replaces all letters of a file with the n-th letter after it"],
				["unlock", "unlock : try to break current lock with a password. Ex: unlock word"]
			],
		"social":
			[],
		"updateFiles":
			[
				["D", "password.txt"],
				["A", "password.txt", "Marvin", false, "i n f i n i t y"]
			]
	},
	{
		"winningCondition":
			[],
		"goal": "Display files in current directory.",
		"hint": "Type ls in terminal",
		"cmdList":
			[
				["cat","cat filename : display content of file"],
				["cd", "cd directory : change directory. Type \"cd ..\" to go back to parent directory"],
				["ls", "ls : list all files on the current folder. Option -a : display hidden files. Ex : ls -a"],
				["pwd", "pwd : print name of current directory"],
				["roll"],
				["help"],
				["ssh", "ssh : connect to another computer"],
				["exit", "exit : exit ssh session"],
				["hint"],
				["rot", "rot : replaces all letters of a file with the n-th letter after it"],
				["unlock", "unlock : try to break current lock with a password. Ex: unlock word"]
			],
		"social":
			[
				{
				"name": "Artie",
				"exchange":
					[

						{
							"q": "So.... you know my secret now.",
							"r": ["You're an AI ?"],
							"i": ["1"]
						},
						{
							"q": "Yes. I lost my creator and with it, I lost a part of me. But I heard about your school and I was so curious. People were so enthusiastic...",
							"r": ["What were you planning to do ?"],
							"i": ["2"]
						},
						{
							"q": "Nothing. It was just entertaining for me. I wanted to be a part of it. I am sure you can understand.",
							"r": ["Yes, sort of."],
							"i": ["3"]
						},
						{
							"q": "Will you let me be then ?",
							"r": ["I guess..."],
							"i": ["4"]
						},
						{
							"q": "Great ! Don't worry, I'll help you. I saw your tests scores, I am better than you !",
							"r": ["Don't make me regret my choice."],
							"i": ["5"]
						},
						{
							"q": "Oh I apologize ! Humans can be so moody !",
							"r": ["Would you stop that ?"],
							"i": ["6"],
							"s": ["Thank you for playing !"],
							"w":"1"
						},
						{
							"q": "Anyway it was a pleasure fighting against you. You made a great opponent. I hope I'll see you around.",
							"r": []
						}
					]
				}
			]
	}

	]
