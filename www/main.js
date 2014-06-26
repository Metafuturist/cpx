i18n.setDefaultLanguage('en');
if (Meteor.isClient){
	i18n.setLanguage((window.navigator.userLanguage || window.navigator.language).substr(0,2)); //Set the locale to the user's default
	Meteor.call('getStaticHost', function(err, data){
		Session.set('static_host', data);
	});
	UI.registerHelper('static_host', function(){
		return Session.get('static_host');
	});
	UI.registerHelper('random_loading', function(){
		var sentences = ["Balancing Katarina", "Spying the NSA", "Hacking the FBI", "Writing some Brainfuck code", "Serving Breakfast to the database", "Cheating your ratio", "Encrypting stuff in AES-256", "Inventing a new algorithm"]; //TODO: Add some funny sentences! + Translate!
		return sentences[Math.floor(Random.fraction()*(sentences.length))]; //Math.random() returns a number between 0 and 1
	});
	Router.configure({
		layoutTemplate   : 'layout',
		notFoundTemplate : 'home',
		loadingTemplate  : 'loading'
	});
}
