// Add a torrent
Router.route('/torrents/add/',function(){
	this.render("torrents_add", {
		data: function (){ // Pass some data!
			return Session.get('torrent_add');
		}
	});
}, {
	name:"torrents.add",
	onBeforeAction:function(){
		if(!Session.get('torrent_add') || Session.get('torrent_add').step == 99/* FIXME Random step ID */)
			resetTorrentAddData(); //Initialize the form data for the first time or when the user comes back after a done upload
		this.next(); // Don't forget that
	}
});

// Reset the data related to the upload form. Called when the form gets displayed for the first time and on a successful upload
function resetTorrentAddData(){
	Session.set('torrent_add', {
		step:1
	});
}

/***** Template Helpers *****/
Template.torrents_add.helpers({
	'stepIs':function(i){
		return i == Session.get('torrent_add').step;
	}
});

/***** Actions *****/

Template.torrents_add.events({
	'change #step1 input[type="file"]':function(){ // Reset Warnings when the user changes the file
		$('#torrent_add .error, #torrent_add .warn').remove();
	},
	'click button':function(event){ // When the user clicks the "Submit Button"
		event.preventDefault(); // First of all, prevent the default action
		var status=Session.get('torrent_add');
		switch(status.step){
			case 1:
			/******* STEP 1 *******/
			
			// 0 - Clean the error messages
			$('#torrent_add .error').remove();
			
			// 1 - Do we have one selected file ?
			if(document.querySelector('#torrent_add input[type="file"]').files.
			length != 1)
				return $('#torrent_add form').prepend('<div class="error">Please select one file!</div>'); // Stop here
			
			// 2 - Is it a torrent file ?
			var file = document.querySelector('#torrent_add input[type="file"]').files[0];
			if(file.name.slice(-8) != ".torrent")
				return $('#torrent_add form').prepend('<div class="error">Please select a torrent file!</div>'); // Stop here
				
			// 3 - Is the torrent not too big ?
			if(file.size > 500*1024) //file.size is the size of the file in bytes - If it's over 500 Kilobytes, emit a warning
				if($('#torrent_add .warn').size() == 0) // If we didn't emit a warning before
					return $('#torrent_add form').prepend('<div class="warn"><b>This torrent file seems to be huge!</b><br />It looks like you selected a huge torrent file. Are you sure you selected the correct file? Be aware its processing might be slow.<br />If you wanna continue anyway, please click the "Submit" button again.</div>');
				else
					$('#torrent_add .warn').remove();
			
			// 4 - Decode the torrent file
			$('#torrent_add form').addClass('loading'); // As this can take a while, we display a little loading wheel...
			
			// Get the data of the file
			var fileReader = new FileReader(), torrentData;
			fileReader.readAsArrayBuffer(file);
			fileReader.onloadend = function(){
				try { //Let's try to decode the data of the file we just got
					// a - bdecode everything
					torrentData = new Uint8Array(fileReader.result);
					torrentData = bdecode(torrentData);
					if(!torrentData)
						throw 'Could not parse bencoded data';
					
					// b - Establish the list of the files
					if(!torrentData.info)
						throw 'The <code>info</code> field is missing!';
					
					var files = {}; // This will contain the list of the files
					var exts = {}; // This will contain the number of files matching a particular extension
					var n_files = 0, n_folders = 0, size = 0; // While we're on it, let's compute the total size and the number of files and directories
					
					if(torrentData.info.files){
						// Initialise the recursive magic
						function addToTree(tree, data, index){ // Complete the tree with the data from the torrent file
							var appendme = intToString(data.path[index]);
							if(data.path.length - 1 != index){ // If it's not the latest item of the path : we have a folder
								if(!tree[appendme])
									tree[appendme]={}; // If the folder is not defined, define it
								n_folders++;
								tree[appendme] = addToTree(tree[appendme], data, index + 1);
							} else { // It's a file!
								if(tree[appendme]) // This file is already in the tree!
									throw 'Duplicate file';
								tree[appendme] = data.length;
								size += data.length;
								n_files++;
								
								// Add the extension to the counter
								var ext = appendme.split('.').slice(-1)[0];
								if(exts[ext]) // We already have a counter for this extensions
									exts[ext]++;
								else
									exts[ext] = 1;
							}
							return tree;
						}
						
						torrentData.info.files.forEach(function(item){ // Launch the recursive magic
							files = addToTree(files, item, 0);
						});
					} else { // Single-file torrent
						if(torrentData.info.name && torrentData.info.length){
							files[intToString(torrentData.info.name)] = torrentData.info.length;
							n_files=1;
							size = torrentData.info.length;
							exts[intToString(torrentData.info.name).split('.').slice(-1)[0]] = 1;
						}
						else
							throw 'Unable to determine the files of the torrent';
					}
					
					// c - Number of piece hashes
					if(!torrentData.info['piece length'])
						throw 'Unknown piece length';
					
					if(!torrentData.info.pieces)
						throw 'Missing piece hashes';
					
					if(torrentData.info.pieces.length != Math.ceil(size/torrentData.info['piece length']) * 20) // Every hash is a SHA1 Hash, which consists in 40 hexadecimal character, encoded using 20 bytes (1 byte = 2 hexadecimal characters), hence the 20 factor at the end
						throw 'Incorrect number of piece hashes';
				} catch (err){
					$('#step1').before('<div class="error">This torrent file is invalid : <i>' + err + '</i>.<br />Try regenerating it</div>');
				} finally { // In any case, remove the loading loop
					$('#torrent_add form').removeClass('loading');
				}
				// OK, here we have a valid torrent file. We just have to do some very basic checks
				
				// 5 - Additional Checks
				
				// a - Announce tracker
				try{
					var tracker_regex=RegExp("^https?://" + Meteor.settings.public.tracker_host + "/");
					if(!torrentData.announce)
						throw '';
					if(torrentData.announce-list)
						if(torrentData.annouce-list != 1)
							throw '';
						else if(!tracker_regex.test(torrentData.annouce-list[0]))
							throw '';
					if(!tracker_regex.test(torrentData.announce))
						throw '';
				} catch(e) {
					if($('#trackerwarn').size() == 0){ // Display an error message, if not already displayed
						return $('#step1').before('<div class="warn" id="trackerwarn"><b>One moment!</b><br />It looks like this torrent was not generated for ' + Meteor.settings.public.www_name + '.<br />Did you forget to set the tracker URL to <code>http://' + Meteor.settings.public.tracker_host + '/</code> ?<br />Please click the submit button again if you want us to fix it for you.</div>'); // TODO : Add a config option to completely reject or not (just fix them) torrents which don't have our tracker announce URL.
					} else 
						$('#trackerwarn').remove(); // Remove the warning if already displayed
				}
				// Once everything is fine, unify everything
				delete torrentData['announce-list'];
				torrentData.announce = "http://" + Meteor.settings.public.tracker_host + '/';
				// Set the private key to 1
				torrentData.info.private = 1;
				
				/****** Let's go to step 2! ******/
				// 1 - Set the status var with the torrent data
				status.torrent = {};
				status.torrent.data = torrentData;
				status.torrent.name = file.name;
				status.torrent.n_files = n_files;
				status.torrent.n_folders = n_folders;
				status.torrent.size = size;
				status.torrent.files = files;
				
				// 2 - Update the step number
				status.step = 2;
				
				// 3 - Let's try an auto fill !
				// a - Determine the torrent type
				var types = Array(Meteor.settings.public.n_cats).fill(0); // We'll increment a score
				for (ext in exts){
					// Applications - 0
					if(['exe', 'ipa', 'apk'].indexOf(ext) != -1)
						types[0] += 2 * exts[ext];
					// Videos - 1 (Movies) and 3 (TV Shows)
					else if(['mkv', 'mov', 'mp4', 'avi', 'mpeg', 'webm', 'wmv', 'flv']){
						/* We increase them with the same score because if we find "evidence" that our torrent in indeed a TV show (S..E..), we'll boost it a lot.
						If that's not the case, we take the first with the highest score, so we'll fallback to movie */
						types[1] += 2 * exts[ext];
						types[3] += 2 * exts[ext];
					}
					// Music - 2
					else if(['mp3', 'wav', 'ogg', 'oga', 'flac'].indexOf(ext) != -1)
						types[2] += 2 * exts[ext];
					// Books - 4
					else if(['pdf', 'djvu', 'djv', 'rtf', 'epub', 'chm', 'lit', 'azw', 'azw3', 'mobi'])
						types[4] += exts[ext];
					// Others - 5
					else
						types[5] += exts[ext];
				}
				// OK, let's try to determine which type got the stronger score...
				var type = 0, max = types[0];
				for (i = 0; i < Meteor.settings.public.n_cats; i++){
					if(types[i] > max){
						type = i;
						max = types[i];
					}
				}
				
				// Set our Smart Guess variable, we'll probably change a lot of things but these are the defaults
				status.smartGuess = {
					name: intToString(torrentData.info.name),
					type: type
				}
				
				// Just one thing with single-file torrents : remove the extension
				if(n_files == 1 && n_folders == 0){
					status.smartGuess.name = status.smartGuess.name.split('.');
					status.smartGuess.name = status.smartGuess.name.slice(0,status.smartGuess.name.length - 1).join(' '); // Remplace dots by spaces
				}
				
				// Replace dots and underscores by spaces
				status.smartGuess.name = status.smartGuess.name.replace(/[\._]/g, ' '); // The g flag is to match every dot
				
				var analysisResult; // More data we could analyse
				
				// Some more processing - That's where the magic of Smart Guess happens!
				if(type == 0){
					// We can't to a lot here, but at last we can determine the version number
					if(/[ \-]v?([a-z]+?[0-9\.]+)[ \-]/i.test(status.smartGuess.name)){
						analysisResult = /^(.+?)[ \-]+v?([a-z]+?[0-9\.]+)[ \-]+(.+?)$/i.exec(status.smartGuess.name);
						status.smartGuess.version = analysisResult[2];
						status.smartGuess.name = analysisResult[1] + ((analysisResult[1] && analysisResult[3])? ' ': '') + analysisResult[3]; // The ternary operator is to add a space if every part is not empty (as we removed them with the regex)
					}
				} else if(type == 1){ // If we found a video torrent
					var more; // more is the rest of the data we can analyse
					if(/[ \-]S[0-9]{1,}/i.test(status.smartGuess.name)){ // If we have S** in the files, which reveals a TV Show (S01 = Season 01)
						status.smartGuess.type = 3; // Set the type to TV Show : 3
						if(/[ \-]S[0-9]+.+?E[0-9]+[ \-]/i.test(status.smartGuess.name)){ // Is it a specific episode ?
							analysisResult = /^(.+?)[ \-]+S([0-9]+)(?:.+?)?E([0-9]+)[ \-]+(.+?)$/i.exec(status.smartGuess.name);
							// Expected format : "<Show Name> - S**E**"
							status.smartGuess.name = analysisResult[1];
							status.smartGuess.season = analysisResult[2];
							status.smartGuess.episode = analysisResult[3];
							more = analysisResult[4];
						} else if(/[ \-]S[0-9][ \-]/i.test(status.smartGuess.name)){ // It should be a whole season
							analysisResult = /^(.+?)[ \-]+S([0-9]+)[ \-]+(.+?)$/i.exec(status.smartGuess.name);
							// Expected format : "<Show Name> - S**"
							status.smartGuess.name = analysisResult[1];
							status.smartGuess.season = analysisResult[2];
							status.smartGuess.episode = 0;
							more = analysisResult[3];
						}
					} else if(/[ \-][1-9][0-9]+[ \-]/.test(status.smartGuess.name)) { // It's a movie and we have a year isolated
						// We can determine the name and year
						analysisResult = /^(.+?)[ \-]+([1-9][0-9]+)[ \-]+(.+?)$/.exec(status.smartGuess.name);
						status.smartGuess.name = analysisResult[1];
						status.smartGuess.year = analysisResult[2];
						more = analysisResult[3];
					}
					// More analysis : quality
					// First, look for the quality in what's behind the title : who knows, a movie could be called 1080p, so if we begin by the title we would end up with an empty title, but we could have the quality in what we recognised as the title.
					// Recognised patterns : ****p, ****i
					if(/[ \-][0-9]+[pi][ \-]/i.test(more)){
						analysisResult = /^(.+?)[ \-]+([0-9]+[pi])[ \-]+(.+?)$/i.exec(more);
						status.smartGuess.quality = analysisResult[2];
						more = analysisResult[1] + ((analysisResult[1] && analysisResult[3])? ' ': '') + analysisResult[3]; // The ternary operator is to add a space if every part is not empty
					} else if(/[ \-][0-9]+[pi][ \-]/i.test(status.smartGuess.name)){
						analysisResult = /^(.+?)[ \-]+([0-9]+[pi])[ \-]+(.+?)$/i.exec(status.smartGuess.name);
						status.smartGuess.quality = analysisResult[2].toLowerCase();
						more = analysisResult[1] + ((analysisResult[1] && analysisResult[3])? ' ': '') + analysisResult[3];
					}
					
					// Bring back the other data in the title... With a space, eventually
					// TODO
				}
				// TODO : determine the author for books and music
				
				// Update the variable!
				Session.set('torrent_add', status);
				
			}
			
			break;
			case 2: // TODO
				
			break;
		}
			
	}
});