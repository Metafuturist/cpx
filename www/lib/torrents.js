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

// Data tests

country_codes = ["ad","ae","af","ag","ai","al","am","ao","aq","ar","as","at","au","aw","ax","az","ba","bb","bd","be","bf","bg","bh","bi","bj","bl","bm","bn","bo","bq","br","bs","bt","bv","bw","by","bz","ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cr","cu","cv","cw","cx","cy","cz","de","dj","dk","dm","do","dz","ec","ee","eg","eh","er","es","et","fi","fj","fk","fm","fo","fr","ga","gb","gd","ge","gf","gg","gh","gi","gl","gm","gn","gp","gq","gr","gs","gt","gu","gw","gy","hk","hm","hn","hr","ht","hu","id","ie","il","im","in","io","iq","ir","is","it","je","jm","jo","jp","ke","kg","kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv","ly","ma","mc","md","me","mf","mg","mh","mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw","mx","my","mz","na","nc","ne","nf","ng","ni","nl","no","np","nr","nu","nz","om","pa","pe","pf","pg","ph","pk","pl","pm","pn","pr","ps","pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb","sc","sd","se","sg","sh","si","sj","sk","sl","sm","sn","so","sr","ss","st","sv","sx","sy","sz","tc","td","tf","tg","th","tj","tk","tl","tm","tn","to","tr","tt","tv","tw","tz","ua","ug","um","us","uy","uz","va","vc","ve","vg","vi","vn","vu","wf","ws","ye","yt","za","zm","zw"]; // We need this for the author's country

// The model of the author is
check_author = function(author, removeId){
	if(removeId) // If we check the release, the id of the author is embedded, and we don't want to test it
		delete author['_id'];
	check(author, {
		name        : String,
		country     : String,
		img         : String,
		description : String
	});
	// TODO : Much more to test !
}
check_release = function(release){
	check(release, {
		name        : String,
		cat         : Number,
		img         : String,
		description : String,
		author      : Object
	});
	// BUG : The country is not set...
	check_author(release.author, true);
	// TODO : Make sure the author exists!
}