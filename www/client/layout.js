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
	'click #tabs > li':function(event){ // Select tab
		$('#tabs > li').removeClass('selected');
		event.currentTarget.className='selected'
	},
	// Slide
	'mousedown #tabs li.left':function(event){
		event.currentTarget.iid=setInterval(slideLeft, 25);
	},
	'mousedown #tabs li.right':function(event){
		event.currentTarget.iid=setInterval(slideRight, 25);
	},
	'mouseup #tabs li.left, mouseup #tabs li.right, mouseleave #tabs li.left, mouseleave #tabs li.right':function(event){
		event.currentTarget.iid && clearInterval(event.currentTarget.iid);
	},
});
function slideLeft(){
	slide(false);
}
function slideRight(){
	slide(true);
}
function slide(right){
	var item = $('#tabs .selected .content');
	item.scrollLeft(item.scrollLeft() + 5*(right?1:-1))
}