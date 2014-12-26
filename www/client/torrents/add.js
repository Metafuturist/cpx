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
		$('#torrent_add .error, #torrent_add .warning').remove();
	},
	'click button':function(event){ // When the user clicks the "Submit Button"
		event.preventDefault(); // First of all, prevent the default action
		var status=Session.get('torrent_add');
		switch(status.step){
			case 1: // Step 1
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
				if($('#torrent_add .warning').size() == 0)
					return $('#torrent_add form').prepend('<div class="warning"><b>This torrent file seems to be huge!</b>It looks like you selected a huge torrent file. Are you sure you selected the correct file? Be aware its processing might be slow.<br />If you wanna continue anyway, please click the "Submit" button again.</div>');
			
			// 4 - Decode the torrent file
			$('#step1').after('<div class="info">Decoding the torrent file. This may take a while!</div>');
			try{
				var fileReader = new FileReader(), torrentData;
				fileReader.readAsArrayBuffer(file);
				fileReader.onloadend = function(){
					torrentData = new Uint8Array(fileReader.result);
					torrentData = bdecode(torrentData);
					if(!torrentData)
						return $('#step1').before('<div class="error">This is not a torrent file!</div>');
					else
						console.warn(torrentData);
				}
			} catch (err){
				$('#step1').before('<div class="error">Could not decode the torrent file : <i>' + err + '</i></div>');
				$('#step1 .info').remove();
			}
			break;
			case 2: // TODO
				
			break;
		}
			
	}
});