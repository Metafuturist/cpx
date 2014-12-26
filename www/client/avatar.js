/* Some functions used by the avatar generator */
Template.avatar.helpers({
	'bgcolor':function(hash){
		return hash.substr(0,6);
	},
	'translate1':function(hash){
		return (parseInt(hash.substr(6,2), 16)/2.56-25) + ',' + (parseInt(hash.substr(8,2), 16)/2.56-999);
	},
	'translate2':function(hash){
		return (parseInt(hash.substr(10,2), 16)/2.56-100) + ',' + (parseInt(hash.substr(12,2), 16)/2.56-50);
	},
	'translate3':function(hash){
		return (parseInt(hash.substr(14,2), 16)/2.56+200) + ',' + (parseInt(hash.substr(16,2), 16)/2.56+100);
	},
	'isUrl':function(hash){
		return hash[0] == 'h'; // As a hash is SHA1, it cannot contain 'h' because it is Hexadecimal
	},
	'firstLetter':function(a){
		return a.slice(0,1);
	}
});