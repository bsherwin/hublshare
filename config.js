var config = {};

config.endpoint = "wss://<cosmosdb>.gremlin.cosmosdb.azure.com:443/gremlin";
config.primaryKey = "<read key>";

config.resultLimit = 500;
config.datasets = [];
config.datasets.push({
	"name": "<displayname>",
	"database": "<databasename>",
	"collection": "<collectionname>",
	"queries": [
		{"display": "Get All Vertices", "query": "g.V()"},
		{"display": "Get All Edges", "query": "g.E()"}
	]
});
module.exports = config;