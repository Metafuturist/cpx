/******* TORRENTS ********/
Meteor.methods({add_torrent:function(data){
	//TODO
},
add_author:function(data){
	check(data, {
		name : String,
		img  : String,
		biography : String
	})
}});