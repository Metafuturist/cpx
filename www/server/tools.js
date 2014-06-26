/* Utilities file */
var fs= Npm.require('fs');
__dirname= fs.realpathSync('../../../../../'); //This is the root of the application
var statichost;
//Let's set the static host BEFORE anything happens, so that we can return it fastly!
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	if(err)
		throw 'Unable to read configuration file : ' + err;
	config = JSON.parse(data);
	statichost=config.static_url;
	//Let's just make sure our URL ends with a "/"
	if(statichost[statichost.length - 1] != "/")
		statichost += "/";
});

Meteor.methods({
	// Get the static host - Because clients can't read the server config file
	getStaticHost:function(){
		return statichost;
	}
});