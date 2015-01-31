// Add a torrent
Router.route('/torrents/add/',function(){
	this.render("torrents_add");
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
	'step':function(){
		return Session.get('torrent_add').step;
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
				return $('#torrent_add form').prepend('<div class="msg"><div class="error">Please select one file!</div></div>'); // Stop here
			
			// 2 - Is it a torrent file ?
			var file = document.querySelector('#torrent_add input[type="file"]').files[0];
			if(file.name.slice(-8) != ".torrent")
				return $('#torrent_add form').prepend('<div class="msg"><div class="error">Please select a torrent file!</div></div>'); // Stop here
				
			// 3 - Is the torrent not too big ?
			if(file.size > 500*1024) //file.size is the size of the file in bytes - If it's over 500 Kilobytes, emit a warning
				if($('#torrent_add .warn').size() == 0) // If we didn't emit a warning before
					return $('#torrent_add form').prepend('<div class="msg"><div class="warn"><b>This torrent file seems to be huge!</b><br />It looks like you selected a huge torrent file. Are you sure you selected the correct file? Be aware its processing might be slow.<br />If you wanna continue anyway, please click the "Submit" button again.</div></div>');
			
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
						}
						else
							throw 'Unable to determine the files of the torrent';
					}
					
					// c - Number of piece hashes
					if(!torrentData.info['piece length'])
						throw 'Unknown piece length';
					
					if(!torrentData.info.pieces)
						throw 'Missing piece hashes';
					
					if(torrentData.info.pieces.length != Math.ceil(size/torrentData.info['piece length']) * 20) // Every hash is a SHA1 Hash, which consits in 40 hexadecimal character, encoded in 20 bytes (1 byte = 2 hexadecimal characters), hence the 20 factor at the end
						throw 'Incorrect number of piece hashes';
				} catch (err){
					$('#step1').before('<div class="msg"><div class="error">This torrent file is invalid : <i>' + err + '</i>.<br />Try regenerating it</div></div>');
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
					if($('#trackerwarn').size() == 0){
						return $('#step1').before('<div class="msg" id="trackerwarn"><div class="warn"><b>One moment!</b><br />It looks like this torrent was not generated for ' + Meteor.settings.public.www_name + '.<br />Did you forget to set the tracker URL to <code>http://' + Meteor.settings.public.tracker_host + '/</code> ?<br />Please click the submit button again if you want us to fix it for you.</div></div>'); // TODO : Add a config option to completely reject or not (just fix them) torrents which don't have our tracker announce URL.
					}
				}
				// In any case, make it unified now that we're ready to proceed
				delete torrentData['announce-list'];
				torrentData.announce = "http://" + Meteor.settings.public.tracker_host + '/';
				// Set the private key to 1
				torrentData.info.private = 1;
				// Ready to continue!
			}
			
			break;
			case 2: // TODO
				
			break;
		}
			
	}
});