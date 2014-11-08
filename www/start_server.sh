#/bin/sh

# TODO : First, start a nginx server as a proxy so that our content is served using HTTPS. See here : https://stackoverflow.com/questions/17027081/meteor-ssl-connection - Load balance it all with http://opensourcehacker.com/2011/04/15/sticky-session-load-balancing-with-apache-and-mod_balancer-on-ubuntu-linux/ (sticky sessions to make sure each client is connected to the correct worker!)

# Our objective here is to start meteor using remote MongoDB

# Let's ask NodeJS to read the file for us
MONGO_URL=$(node -e "var fs = require('fs');
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	config = JSON.parse(data);
	console.log('mongodb://' + ((config.db.auth_required)? config.db.user + ':' + config.db.password + '@' : '') + config.db.host + ':' + config.db.port + '/' + config.db.name);
});") meteor