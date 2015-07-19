// Collections
Authors = new Meteor.Collection('authors');
Releases = new Meteor.Collection('releases');
Torrents = new Meteor.Collection('torrents');
// Search!
/* Called when searching using the default field
Releases.initEasySearch(['name'], {
    'limit' : 20,
    'use' : 'mongo-db',
	'permission' : function(userId){
		return userId !== null;
	}
});*/
// Search for an author
Authors.initEasySearch(['name'], {
	'limit' : 20,
	'use' : 'mongo-db', // TODO : Switch to ElasticSearch for fuzzy matching!
	'permission' : function(userId){
		return userId !== null;
	}
});

// Search for a release with some data about the author
EasySearch.createSearchIndex('releases-with-author', {
	'field' : ['name'],
	'collection' : Releases,
	'limit' : 20,
	'use' : 'mongo-db', // TODO : Switch to ElasticSearch for fuzzy matching!
	'permission' : function(userId){
		return userId !== null;
	},
	'props' : {
		'author' : undefined
	},
	'query' : function (searchString) {
		// Default query that will be used for searching
		var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
		// Filter with the author if set
		if(this.props.author)
			query["author._id"] = this.props.author;

		return query;
	}
});