/****** ROUTER CONFIGURATION ******/

// Templates to use
Router.configure({
	layoutTemplate   : 'layout',
	notFoundTemplate : 'notfound',
	loadingTemplate  : 'loading'
});

// Set the title of the page
Router.onAfterAction(function() {
	if(!Meteor.user()) // If the user is not logged in, give him a login title
		document.title = Meteor.settings.public.www_name + ' - ' + i18n("login.title");
	else
		document.title = Meteor.settings.public.www_name + ' - ' + (i18n(this.route.getName() + '.title') || i18n("notitle"));
});