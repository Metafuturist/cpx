if(Meteor.isClient){
	// Is the user connected when page loads?
	Meteor.startup(function(){
		if(Meteor.user())
			$('body').addClass('connected'); //If that's the case, let's show him the content
		// Load the data related to the user...
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
			var user = form.find('input[type="text"]').val();
			var pass = form.find('input[type="password"]').val();
			
			form.find('input').attr('disabled', ''); // Disable every input!
			form.find('.error').remove(); // Clear all error messages - Perhaps work on better way to appear and disappear?
			if(user == "" || pass == "")
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.fillfields')));
			else if(user.length < 3)
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.tooshortuser')));
			else if(pass.length < 6)
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.tooshortpass')));
			else{
				form.find('input[type="password"]').val(''); // Clear the password!
				Meteor.loginWithPassword(user, pass, function(err){
					$('#login > div .login input').removeAttr('disabled');
					if(err) // Something went wrong.
						return $('#login > div > .login h1').after($('<div>').addClass('error').html(i18n('login.error.badlogin')));
					//Everything is OK here, let's log in the user!
					$('body').addClass('connected');
					Meteor.subscribe('userData', 'me'); // Load the user's data while you're on it
				});
				return;
			}
			form.find('input').removeAttr('disabled');
		}, 
		'submit .mainblock .register form': function(event){
			event.preventDefault();
	
			if(Meteor.loggingIn()) // If we are already logging in
				return;
			
			var form  = $(event.target);
			var user  = form.find('input[type="text"]').val();
			var pass  = form.find('input[type="password"]').first().val();
			var pass2 = form.find('input[type="password"]').last().val();
			var email = form.find('input[type="email"]').last().val();
			
			form.find('input').attr('disabled', ''); // Disable every input!
			form.find('.error').remove(); // Clear all error messages - Perhaps work on better way to appear and disappear?
			if(user == "" || pass == "")
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.fillfields')));
			else if(user.length < 3)
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.tooshortuser')));
			else if(pass.length < 6)
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.tooshortpass')));
			else if (pass != pass2)
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.differentpasses')));
			else if (!(/[a-z0-9_\-\\\/]+@[a-z0-9]+\.[a-z]+/i.test(email)))
				form.parent().find('h1').after($('<div>').addClass('error').html(i18n('login.error.invalidmail')));
			else{
				form.find('input[type="password"]').val(''); //Clear the passwords!
				Accounts.createUser({
					username : user,
					password : pass,
					email    : email
				},function(err){
					$('#login > div .register input').removeAttr('disabled');
					if(err)
						return $('#login > div .register h1').after($('<div>').addClass('error').html(i18n(err.reason)));
					$('body').addClass('connected'); //So it's ok, let's connect say you're connected and load your data
					Meteor.subscribe('userData', 'me');
				});
				return;
			}
			form.find('input').removeAttr('disabled');
		}
	});
}