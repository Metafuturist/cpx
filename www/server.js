// Loading modules
var app = require('express')();
var fs = require('fs');
var swig = require('swig');
var mysql = require('mysql');

var config, db; //Define these variables out of any function so that they are global and accessible by everyone

// Getting the configuration
fs.readFile(__dirname + '/../config.json', {encoding: 'utf-8'}, function(err, data){
	if(err)
		throw 'Unable to read configuration file : ' + err;
	config = JSON.parse(data);
	
	// Set a Database Connections Pool.
	db = mysql.createPool({
		connectionLimit : 100, // This is the maximum of connections to the MySQL server, set it!
		host            : config.db_host,
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
			
			// You must use this everytime you're done with a connection so that other can use it!
			connection.release();
			
			// Checking if the server replied correctly
			if(rows[0].answer != 2)
				throw 'The Database did not reply correctly to our test request.';
			
			// Time to start the WebServer!
			app.listen(8000);
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

app.use(function(req, res){
	res.send(404, 'Page not found'); // This should be modified so that we have a cool webpage
});