#/bin/sh

# Short file to start mongoDB with the correct arguments

# Where will MongoDB store its stuff?
DIR=$(pwd)

# Again, NodeJS will help us in getting the configuration read
PORT=$(node -p "var fs = require('fs');
JSON.parse(fs.readFileSync(__dirname + '/../config.json', {encoding: 'utf-8'})).db.port")

mongod --port $PORT --quiet --dbpath $DIR
