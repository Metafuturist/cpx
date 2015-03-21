i18n.map('fr', {
	login : {
		title : "Connexion",
		user  : "Nom d'utilisateur",
		pass  : "Mot de passe",
		pass2 : "Mot de passe (vérification)",
		email : "Adresse e-mail",
		reg   : "Inscription",
		error : {
			fillfields      : "Vous devez remplir tous les champs!",
			badlogin        : "Combinaison Nom d'utilisateur/Mot de passe incorrecte.",
			tooshortuser    : "Votre nom d'utilisateur doit faire au moins 3 caractères!",
			toolonguser     : "Votre nom d'utilisateur ne doit pas faire plus de 30 caractères!",
			tooshortpass    : "Votre mot de passe doit faire au moins 6 caractères!",
			invalidmail     : "Votre adresse e-mail est erronée!",
			toomanyusers    : "Désolé, nous sommes déjà complets!",
			differentpasses : "Les deux mots de passe sont différents!",
			usertaken       : "Ce nom d'utilistateur est déjà pris!",
			mailtaken       : "Cette adresse e-mail est déjà prise!"
		},
		links : {
			regintro   : "Pas encore de compte?",
			reg        : "Inscrivez-vous!",
			loginintro : "Vous avez déjà un compte?",
			login      : "Connectez-vous!"
		}
	},
	torrents : {
		name     : "Torrents",
		home     : {
			name  : "Plus récents",
			title : "Derniers torrents ajoutés"
		},
		search   : {
			title : "Rechercher un torrent"
		},
		best     : {
			name  : "Plus téléchargés",
			title : "Torrents les plus téléchargés"
		},
		random   : "Au hasard",
		add      : {
			name  : "Ajouter",
			title : "Ajouter un torrent",
			step  : {
				1 : {
					title   : "Etape 1 : Choisissez votre fichier torrent",
					summary : "dans {$1} fichier(s) et {$2} dossier(s) avec le fichier :<br><code>{$3}</code>"
				},
				2 : {
					title    : "Etape 2 : Ajoutez quelques informations sur ce torrent",
					category : "Catégorie"
				}
			},

			warn  : {
				tracker : "<b>Un instant!</b><br />On dirait que ce torrent n'a pas été généré pour {$1}.<br />Avez-vous oublié de mettre <code>http://{$2}/</code> en tant que tracker ?<br />Cliquez à nouveau sur le bouton 'Valider' si vous voulez que nous arrangions cela automatiquement."
			},
			submit: "Valider"
		}
	},
	community : {
		name : "Communauté",
		forum : {
			title : "Forum",
			search : {
				title : "Rechercher un message"
			},
			myposts : {
				title : "Mes messages"
			},
		},
		blog : {
			title : "Blog"
		},
		imagehost : "Hébergeur d'images",
		polls : {
			title : "Sondages"
		},
		donations : {
			title : "Dons"
		},
		users : {
			search : {
				title : "Rechercher un utilisateur..."
			}
		},
		messages : {
			title : "Messagerie"
		}
	},
	help : {
		name :  "Aide",
		wiki : {
			title  : "Wiki",
			search : {
				title : "Rechercher des articles"
			}
		},
		staff : {
			title : "Équipe"
		},
		rules : {
			title : "Règles"
		}
	},
	myaccount : {
		name      : "Mon Compte",
		profile   : "Profil",
		favorites : "Favoris",
		images    : "Images",
		settings  : "Paramètres",
		friends   : "Amis",
		shop      : "Boutique",
		warns     : "Avertissements"
	},
	categories : {
		0 : 'Applications',
		1 : 'Films',
		2 : 'Emission TV',
		3 : 'Musique',
		4 : 'Livres',
		5 : 'Divers'
	},
	sizes   : {
		0 : 'o', 
		1 : 'Kio', 
		2 : 'Mio', 
		3 : 'Gio', 
		4 : 'Tio', 
		5 : 'Pio',
		length : '6'
	},
	notitle : "Page sans titre",
	loading : {
		prepend   : "Un instant, ",
		length    : "7",
		_comment  : "length = nombre de phrases",
		sentences : [
			"Recherche des racines d'un polynôme du 42ème degré",
			"Espionnage de la NSA",
			"Hack du FBI",
			"Ecriture d'un script en Brainfuck",
			"Benchmarking de la base de données",
			"Recherche de failles dans le système du ratio",
			"Vérification de la somme MD-5 de 'a'",
			"Invention d'un nouvel algorithme révolutionnaire..."
		]
	},
	credits : 'Encore un site génial utilisant le projet CPX!'
});