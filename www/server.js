// Loading modules
var app = require('express')();
var fs = require('fs');
var swig = require('swig');
var mysql = require('mysql');
var crypto = require('crypto');

// Global tools
var config, db;

console.info(' *******************');
console.info(' * Welcome to CPX! *');
console.info(' *******************');
console.info('');
console.info('This is the main server');
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
	console.log(' * Testing database connection...');
	
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
			
			console.log('It seems database is working! Launching webserver...');
			// Time to start the WebServer!
			app.listen(config.www_port);
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

// Setting application settings - Rendering
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Disable caching views - DON'T LET THIS IN PRODUCTION !
// * Express
app.set('view cache', false);
// * Swig
swig.setDefaults({cache: false});

// This is where we declare all our pages!
app.get('/', function(req, res){
	var date = new Date();
	var time = date.getHours() + ':' + date.getMinutes();
	res.render('index', {
		pagename: req.param('name'),
		time: time,
		now: date
	});
});

// Giving a reply in case of 404
app.use(function(req, res){
	res.send(404, 'Page not found'); // This should be changed so that we have a cool webpage
});

function hashpw(password){
	var sha1 = crypto.createHash('sha1'); // I'll use SHA-1 to crypt the password. Know a better algorithm ? Let me know!
	// We add the caracters as UTF-8, just in case...
	sha1.update('à"èf@dçS2Gl=$é^', 'utf8'); // Salting passwords
	sha1.update(password, 'utf8'); // Password to hash
	sha1.update('$éd090éDF@é{~è&', 'utf8'); // I love salt!
	// Return hexdecimal hash
	return sha1.digest('hex');
}