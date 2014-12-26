/****** LOADING PAGE ******/
UI.registerHelper('loading', function(){ //Get a random loading phrase ID
	return "loading.sentences." + Math.floor(Random.fraction()*parseInt(i18n("loading.length")));
});