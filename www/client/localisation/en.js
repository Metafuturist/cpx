i18n.map('en', {
	login : {
		title : "Log In",
		user  : "Username",
		pass  : "Password",
		pass2 : "Password (check)",
		email : "E-mail address",
		reg   : "Register",
		error : {
			fillfields      : "You must fill all fields!",
			badlogin        : "Username/Password combination unrecognized.",
			tooshortuser    : "Your username must be at least 3 characters long!",
			toolonguser     : "Your username must not be over 30 characters!",
			tooshortpass    : "Your password must be at least 6 characters long!",
			invalidmail     : "You typed a wrong e-mail address!",
			toomanyusers    : "Sorry, we're already full!",
			differentpasses : "Passwords must match!",
			usertaken       : "This Username is already taken!",
			mailtaken       : "This e-mail address is already taken!"
		},
		links : {
			regintro   : "Don't have an account?",
			reg        : "Register!",
			loginintro : "Already have an account?",
			login      : "Log In!"
		}
	},
	torrents : {
		name     : "Torrents",
		home     : {
			name  : "Last added",
			title : "Latest torrents"
		},
		search   : {
			title : "Find a torrent"
		},
		best     : {
			name  : "Most Downloaded",
			title : "Most Downloaded Torrents"
		},
		random   : "Random",
		add      : {
			name  : "Upload",
			title : "Add a torrent",
			reset : {
				button  : "Reset the form",
				confirm : "Are you sure you want to reset the upload form ?"
			},
			step  : {
				1 : {
					title   : "Step 1 : Select your torrent file",
					summary : "in {$1} file(s) and {$2} folder(s) using file :<br><code>{$3}</code>"
				},
				2 : {
					title    : "Step 2 : Provide torrent details",
					category : "Category",
					release  : "Release",
					author   : "Author",
					year     : "Year",
					version  : "Version"
				}
			},
			warn  : {
				tracker : "<b>One moment!</b><br />It looks like this torrent was not generated for {$1}.<br />Did you forget to set the tracker URL to <code>http://{$2}/</code> ?<br />Please click the 'Submit' button again if you want us to fix it for you."
			},
			submit: "Submit"
		}
	},
	community : {
		name : "Community",
		forum : {
			title : "Forum",
			search : {
				title : "Find a post"
			},
			myposts : {
				title : "My posts"
			},
		},
		blog : {
			title : "Blog"
		},
		imagehost : "Image Hoster",
		polls : {
			title : "Polls"
		},
		donations : {
			title : "Donations"
		},
		users : {
			search : {
				title : "Find a user"
			}
		},
		messages : {
			title : "inbox"
		}
	},
	help : {
		name :  "Help",
		wiki : {
			title : "Wiki",
			search : {
				title : "Find an article"
			}
		},
		staff : {
			title : "Staff"
		},
		rules : {
			title : "Rules"
		}
	},
	myaccount : {
		name      : "My account",
		profile   : "Profile",
		favorites : "Favoris",
		images    : "Images",
		settings  : "Settings",
		friends   : "Friends",
		shop      : "Shop",
		warns     : "Warns"
	},
	categories : {
		0 : 'Applications',
		1 : 'Movies',
		2 : 'TV Shows',
		3 : 'Music',
		4 : 'Books',
		5 : 'Other'
	},
	sizes   : {
		0 : 'B', 
		1 : 'KiB', 
		2 : 'MiB', 
		3 : 'GiB', 
		4 : 'TiB', 
		5 : 'PiB',
		length : '6'
	},
	notitle : "Untitled page",
	loading : {
		prepend   : "One moment, ",
		length    : "7",
		_comment  : "length = number of sentences",
		sentences : [
			"Finding the roots of a 42nd degree polynomial",
			"Spying the NSA",
			"Hackink the FBI",
			"Writing a Brainfuck script",
			"Benchmarking the database",
			"Looking for breaches in the ratio system",
			"Checking the MD-5 sum of 'a'",
			"Inventing a revolutionary algorithm..."
		]
	},
	credits : "Another great website powered by the CPX project!"
});