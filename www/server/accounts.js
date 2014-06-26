// This is where the routine of the server ONLY takes place... This file and the others in the same directory WON'T be served to the client!
if (Meteor.isServer) {
	Meteor.startup(function () {
		console.log('CPX Server started!'); // Let's just write to stuff, but that's not useful. Honestly
	});
	Accounts.validateNewUser(function(user){
		if(user.username.length < 3)
			throw new Meteor.Error(403, 'login.error.tooshortuser');
		if(user.username.length > 30)
			throw new Meteor.Error(403, 'login.error.toolonguser');
		// NOTE : We can't check the length of the password because it is sent encrypted to the server.
		user.emails.forEach(function(data){
			if(!/.+@.+\.[a-z]{2,3}/.test(data.address))
				throw new Meteor.Error(403, 'login.error.invalidmail');
		});
		if(Meteor.users.find().count() > 42) //FIXME Read the max users value from the config!
			throw new Meteor.Error(403, 'login.error.toomanyusers');
		if(Meteor.users.find().count() > 0)
			throw new Meteor.Error(403, 'login.error.usertaken');
		return true;
	});
	Accounts.onCreateUser(function(options, user){
		//I think we can safely initialise the ratio!
		user.upload = 4096; //FIXME Set this value from the configuration and see how the tracker is going to update it!
		user.download = 0; //0 Bytes
		user.avatar = Meteor.call('getStaticHost') + 'avatar.php?name=' + user.username;
		return user;
	});
}