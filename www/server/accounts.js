Crypto = Npm.require('crypto');
// This is where the routine of the server ONLY takes place... This file and the others in the same directory WON'T be served to the client!
Accounts.validateNewUser(function(user){
	if(user.username.length < 3)
		throw new Meteor.Error(403, 'login.error.tooshortuser');
	if(user.username.length > 30)
		throw new Meteor.Error(403, 'login.error.toolonguser');
	// NOTE : We can't check the length of the password because it is sent encrypted to the server. But it is client-side checked, still better than nothing.
	user.emails.forEach(function(data){
		if(!/.+@.+\.[a-z]{2,3}/.test(data.address))
			throw new Meteor.Error(403, 'login.error.invalidmail');
		if(Meteor.users.find({emails: {$elemMatch: {address: data.address}}}).count() > 0)
			throw new Meteor.Error(403, 'login.error.mailtaken');
	});
	if(Meteor.users.find().count() > 42) //FIXME Read the max users value from the config! (Here:42)
		throw new Meteor.Error(403, 'login.error.toomanyusers');
	if(Meteor.users.find({username: user.username}).count() > 0)
		throw new Meteor.Error(403, 'login.error.usertaken');
	return true;
});
Accounts.onCreateUser(function(options, user){
	//I think we can safely initialise the ratio!
	user.upload = 4096; //FIXME Set this value from the configuration and see how the tracker is going to update it!
	user.download = 0; //0 Bytes
	// Initialise the avatar, using a very simple hash method
	shasum = Crypto.createHash('sha1');
	shasum.update(user.username);
	user.avatar = shasum.digest('hex');
	return user;
});
Meteor.publish('userData', function(id){ //Get some data about a certain user
	if(id == 'me')
		return Meteor.users.find({_id: this.userId}, {fields:{'services':0}}); //Tell him all we know about him, except the annoying password stuff
});