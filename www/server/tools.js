/* Utilities file */

var fs         = Npm.require('fs');
__dirname      = fs.realpathSync('../../../../../'); //This is the root of the application
var configData = {};

//Let's set the config data BEFORE anything happens, so that we can return it fastly!
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	if(err)
		throw 'Unable to read configuration file : ' + err;
	config = JSON.parse(data);
	
	//Let's just make sure our URL ends with a "/"
	if(config.static_url[config.static_url.length - 1] != "/")
		config.static_url += "/";
	
	configData.static_host = config.static_url;
	configData.www_name    = config.www_name;
});

Meteor.methods({
	// Get some config data - Because clients can't read the server config file
	getConfig:function(){
		return configData;
	}
});