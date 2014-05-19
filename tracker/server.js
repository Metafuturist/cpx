// Calling basic modules - no express here!
var http = require('http');
var mysql = require('mysql');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');

console.info(' *******************');
console.info(' * Welcome to CPX! *');
console.info(' *******************');
console.info('');
console.info('This is the tracker server');

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

console.info('');
console.info(' * Loading Configuration...');

// Getting the configuration
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	if(err)
		throw 'Unable to read configuration file : ' + err;
	config = JSON.parse(data);
	
	console.log('Successfully loaded configuration !');
	
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
				console.warn('Could not set Database encoding as UTF-8 : ' + err);
			connection.query('USE ' + config.db_name, function(err, rows){ // Use our database
				if(err)
					console.warn('Could not use CPX Database : ' + err);
			}); 
		});
	});
	
	console.log('');
	console.log(' * Checking database connectivity...');
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
			
			console.log('It seems database is working! Launching tracker...');
			// Time to start the tracker!
			server.listen(config.tracker_port);
			console.log('Everything shoud be OK now, have fun!');
			
			// Now that the connection is established, we must ensure it ends gracefully
			process.on('SIGINT', function(){
				console.log('');
				console.log(' * Got interrupt signal, closing database connections...');
				db.end(function(err){
					if(err)
						console.warn('Something went wrong trying to close database connections : ' + err);
					else
						console.info('Connections closed!');
					console.info('');
					console.info('All done! Thank your for using CPX!');
					// Now we can leave!
					process.exit(0);
				});
			});
		});
	});
});