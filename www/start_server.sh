#/bin/sh

# Our objective here is to start meteor using remote MongoDB

# Let's ask NodeJS to read the file for us
MONGO_URL=$(node -p "var fs = require('fs');
config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', {encoding: 'utf-8'}));
'mongodb://' + ((config.db.auth_required)? config.db.user + ':' + config.db.password + '@' : '') + config.db.host + ':' + config.db.port + '/' + config.db.name") meteor --settings ../config.json
