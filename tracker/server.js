// Calling basic modules - no express here!
var http = require('http');
var mysql = require('mysql');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req, res){
	switch(url.parse(req.url).pathname){
		case '/announce':
			res.writeHead(200, {'Content-type': 'text/plain'});
			res.end('Not implemented yet'); //TODO
		case '/scrape':
			res.writeHead(200, {'Content-type': 'text/plain'});
			res.end('Not implemented yet'); //TODO
		default:
			res.writeHead(404, {'Content-type': 'text/plain'});
			res.end('Method not allowed');
	}
});

// Getting the configuration
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	if(err)
		throw 'Unable to read configuration file : ' + err;
	config = JSON.parse(data);
	
	// Set a Database Connections Pool.
	db = mysql.createPool({
		connectionLimit : config.db_max_links,
		host            : config.db_host,
		port            : config.db_port,
		user            : config.db_user,
		password        : config.db_password
	});
	
	// Every time a connection is made with the Database, set some stuff...
	db.on('connection', function(connection){
		connection.query('SET NAMES UTF8', function(err, rows){ // Use UTF-8 encoding
			if(err)
				console.log('Could not set Database encoding as UTF-8 : ' + err);
			connection.query('USE ' + config.db_name, function(err, rows){ // Use our database
				if(err)
					console.log('Could not use CPX Database : ' + err);
			}); 
		});
	});
	
	// Let's see if the database works !
	db.getConnection(function(err, connection){
		if(err)
			throw 'Could not connect to the Database : ' + err;
		
		// Ask some random stuff to see if it works correctly
		connection.query('SELECT 1+1 AS answer ', function(err, rows){
			if(err)
				throw 'Could not connect to the Database : ' + err;
			
			// You must use this everytime you're done with a connection so that others can use it!
			connection.release();
			
			// Checking if the server replied correctly
			if(rows[0].answer != 2)
				throw 'The Database did not reply correctly to our test request.';
			
			// Time to start the Tracker!
			server.listen(config.tracker_port);
		});
	});
});