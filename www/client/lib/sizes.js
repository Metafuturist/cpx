/***** Sizes Helpers *****/
UI.registerHelper('toReadableSize', function(a){ // Get a readable size from a size in bytes
	if(a === undefined) // If the data is not ready yet
		return '?';
	
	var b=0, max=parseInt(i18n('sizes.length'));
	while(a>1024 && b < max){
		a/=1024;
		b++;
	}
	return Math.floor(a*100)/100 + ' ' + i18n('sizes.' + b);
});