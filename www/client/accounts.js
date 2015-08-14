// Is the user connected when page loads?
Meteor.startup(function(){
	if(Meteor.user())
		$('body').addClass('connected'); //If that's the case, let's show him the content
	// Load the data related to the user... Even if not connected, so that when the user connects it's already done
	Meteor.subscribe('userData', 'me');
});
// Events when the user clicks on the link
Template.login.events({
	'click form > span a': function(event){
		event.preventDefault();
		$("#login div.mainblock > div[class]").each(function(){
			$(this).parent().toggleClass($(this).attr('class'));
		});
	},
	// When the user clicks the login button...
	'submit .mainblock .login form': function(event){
		event.preventDefault();
		if(Meteor.loggingIn()) // If we are already logging in
			return;
		
		var form = $(event.target);
		
		try{
			var user = form.find('input[type="text"]').val();
			var pass = form.find('input[type="password"]').val();
			
			form.find('input').attr('disabled', ''); // Disable every input!
			form.find('.error').remove(); // Clear all error messages - Perhaps work on better way to appear and disappear?
			if(user == "" || pass == "")
				throw 'fillfields';
			if(user.length < 3)
				throw 'tooshortuser';
			if(pass.length < 6)
				throw 'tooshortpass';
			
			// All the tests passed, let's check credentials now!
			
			form.addClass('loading'); // At this very moment we may have to wait for the server, so let's add the loading wheel
			form.find('input[type="password"]').val(''); // Clear the password
			Meteor.loginWithPassword(user, pass, function(err){
				$('#login > div .login form').removeClass('loading'); // The server replied!
				$('#login > div .login input').removeAttr('disabled');
				if(err) // Something went wrong.
					return $('#login > div > .login h1').after($('<div>').addClass('error').html(i18n('login.error.badlogin')));
				//Everything is OK here, let's log in the user!
				$('body').addClass('connected');
			});
			
		} catch(e){ // If there was an error
			form.find('input').removeAttr('disabled');
			form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.' + e)));
		}
	}, 
	'submit .mainblock .register form': function(event){
		event.preventDefault();

		if(Meteor.loggingIn()) // If we are already logging in
			return;
		
		try {
			var form  = $(event.target);
			var user  = form.find('input[type="text"]').val();
			var pass  = form.find('input[type="password"]').first().val();
			var pass2 = form.find('input[type="password"]').last().val();
			var email = form.find('input[type="email"]').last().val();
			
			form.find('input').attr('disabled', ''); // Disable every input!
			form.find('.error').remove(); // Clear all error messages - Perhaps work on better way to appear and disappear ?
			if(user == "" || pass == "")
				throw 'fillfields';
			if(user.length < 3)
				throw 'tooshortuser';
			if(pass.length < 6)
				throw 'tooshortpass';
			if (pass != pass2)
				throw 'differentpasses';
			if (!(/[a-z0-9_\-\\\/]+@[a-z0-9]+\.[a-z]+/i.test(email)))
				throw 'invalidmail';
			
			// We passed the tests! Let's register!
			$('.mainblock .register form').addClass('loading');
			form.find('input[type="password"]').val(''); //Clear the passwords!
			Accounts.createUser({
				username : user,
				password : pass,
				email    : email
			}, function(err){
				$('#login > div .register input').removeAttr('disabled');
				$('.mainblock .register form').removeClass('loading');
				if(err)
					return $('#login > div .register h1').after($('<div>').addClass('error').html(i18n('login.error.' + err.reason)));
				$('body').addClass('connected'); //So it's OK, let's connect say you're connected
			});
			
		} catch(e) { // If there was an error
			form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.' + e )));
			form.find('input').removeAttr('disabled');
		}
	}
});