i18n.setDefaultLanguage('en');
if (Meteor.isClient){
	i18n.setLanguage((window.navigator.userLanguage || window.navigator.language).substr(0,2)); //Set the locale to the user's default
	Meteor.call('getConfig', function(err, data){
		if(err) //This is crucial data. If we don't have it, we must reload the page in order to retry
			return window.reload();
		Session.set('www_name'   , data.www_name);
		Session.set('static_host', data.static_host);
		
		//We can also change the host in the header
		document.head.innerHTML = document.head.innerHTML.replace(/<!--(.+?)https:\/\/0.0.0.0\/(.+?)-->/g, "$1" + data.static_host + "$2");
		
		// And the webpage Title
		document.title = data.www_name + " - " + i18n('login.title');
	});
	UI.registerHelper('static_host', function(){
		return Session.get('static_host');
	});
	UI.registerHelper('www_name', function(){
		return Session.get('www_name');
	});
	UI.registerHelper('loading', function(){ //Get a random loading phrase ID
		return "loading.sentences." + Math.floor(Random.fraction()*parseInt(i18n("loading.length")));
	});
	//Basic router configuration
	Router.configure({
		layoutTemplate   : 'layout',
		notFoundTemplate : 'home',
		loadingTemplate  : 'loading'
	});
}
