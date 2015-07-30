/****** LAYOUT ******/
// Header
// Ratio : Divide Helper - toReadableSize is in the size lib
UI.registerHelper('divide', function(a, b){
	if(a === undefined || b ===undefined)
		return '?';
	if(b == 0)
		return '∞';
	else
		return a/b;
});

// Tabbed menu
Template.layout.events({
	'click #menu > li':function(event){ // Select tab
		$('#menu > li').removeClass('selected');
		event.currentTarget.className='selected'
	}
});