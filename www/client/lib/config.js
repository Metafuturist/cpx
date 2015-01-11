/****** CONFIG DATA *******/
// Helpers so that the templates can get the settings
UI.registerHelper('static_url', function(){
	return Meteor.settings.public.static_url;
});
UI.registerHelper('www_name', function(){
	return Meteor.settings.public.www_name;
});
