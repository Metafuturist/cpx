// Home of the website : list of the lastest torrents
Router.route('/', function(){
	this.render('torrents_home');
}, {
	name:'torrents.home'
});