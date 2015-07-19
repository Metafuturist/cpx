/****** LOADING PAGE ******/
Template.loading_sentence.helpers({loading: function(){ //Get a random loading phrase ID
	return "loading.sentences." + Math.floor(Random.fraction()*parseInt(i18n("loading.length")));
}});