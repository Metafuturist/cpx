Package.describe({
	name: 'cpx:bencode',
	summary: 'Bencoding library made for the CPX project',
	version: "1.0.0"
});

Package.on_use(function(api){
	// The things we want to export!
	api.export('bencode');
	api.export('bdecode');
	// Don't forget to put the file everywhere
	api.add_files('bencode.js', ['client', 'server']);
});