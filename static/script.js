window.onload = function(){
	/* LOGIN SECTION */
	//Login section changes through links.
	document.querySelector('#login div div.login a').onclick=function(){
		//When you clic on the link on the login screen, switch the class...
		document.querySelector('#login div.mainblock').classList.remove('login');
		document.querySelector('#login div.mainblock').classList.add('register');
		return false;
	}
	document.querySelector('#login div div.register a').onclick=function(){
		//Same as before, but for the register screen
		document.querySelector('#login div.mainblock').classList.remove('register');
		document.querySelector('#login div.mainblock').classList.add('login');
		return false;
	}
	document.querySelector('#login div div.login form').onsubmit=function(){
		//Let's get the user input
		var user = document.querySelector('#login div div.login form input[type="text"]').value;
		var password = document.querySelector('#login div div.login form input[type="password"]').value;
		document.querySelector('#login div div.login form input[type="password"]').value=""; //Always clear the password, 'cause we're bastards
		var inputs = document.querySelectorAll('#login div div.login form input');
		for(var i=0; i<inputs.length; i++){
			inputs[i].disabled=true;
		}
		//Simply checking here, but has to be done with the server!
		document.getElementById('loading').className="active";
		setTimeout(function(){
			document.getElementById('loading').className="";
			if(user == "admin" && password == "test")
			{
				document.body.className="connected"; //We're done! You're connected!
			} else {
				//document.querySelector('#login div.login h1').ap
			}
			// Anyway, we can re-enable the stuff in the form
			var inputs = document.querySelectorAll('#login div div.login form input')
			for(var i=0; i<inputs.length; i++){
				inputs[i].disabled=false;
			}
		}, 1000);
		return false;
	}
}