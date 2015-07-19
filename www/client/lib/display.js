// Simple tweak to display the id of MongoDB documents correctly - This overrides the default "_id" behaviour
Template.registerHelper('_id', function (arg) {
	// The optional argument enables the use of this helper even if the _id is set in a sub document (example in the release search of the upload form, with the author _id)
	if(!arg)
		arg=this._id;
	return arg._str;
});