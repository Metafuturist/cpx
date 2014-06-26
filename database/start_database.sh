#/bin/sh

# Short file to start mongoDB with the correct arguments

# Where will MongoDB store its stuff?
DIR=$(pwd)

# Again, NodeJS will help us in getting the configuration read
PORT=$(node -e "var fs = require('fs');
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	config = JSON.parse(data);
	console.log(config.db.port);
});")

mongod --port $PORT --quiet --dbpath $DIR
