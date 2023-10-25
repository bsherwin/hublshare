/*jshint esversion: 8 */

const Gremlin = require('gremlin');
const config = require("./config");
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
var db;
var coll;
var authenticator;
var client;


function getAuthenticator (database, collection) {
	if (database !== db || collection !== coll) {
		console.log("getting authenticator");
		client = null;
		authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${database}/colls/${collection}`, config.primaryKey);
		db = database;
		coll = collection;
	}
	return authenticator;
}

function getClient (authenticator) {
	if (client == null) {
		console.log("getting client");
		client = new Gremlin.driver.Client(
			config.endpoint,
			{
				authenticator,
				traversalsource: "g",
				rejectUnauthorized: true,
				mimeType: "application/vnd.gremlin-v2.0+json"
			}
		);
	}
	return client;
}


exports.runQuery = function (query, database, collection, callback) {
	var dataset = [];
	dataset.vertices = [];
	dataset.edges = [];
	edgeIds = [];
	vertexIds = [];

	var qAuthenticator = getAuthenticator(database, collection);
	var qClient = getClient(qAuthenticator);
	query += ".limit(" + config.resultLimit + ")";

	qClient.open();
	console.log(query);
	qClient.submit(query, {})
		.then(function (result) {
			console.log("results are in");
			result._items.forEach(element => {
				if (element.labels != undefined) {
					element.objects.forEach(result => {
						if (result.type == 'edge') {
							if (edgeIds.indexOf(result.id) == -1) {
								dataset.edges.push(result);
								edgeIds.push(result.id);
							}
						} else {
							if (vertexIds.indexOf(result.id) == -1) {
								dataset.vertices.push(result);
								vertexIds.push(result.id);
							}
						}
					});
				} else if (element.type == 'edge') {
					dataset.edges.push(element);
				} else {
					dataset.vertices.push(element);
				}
			});
		})
		.catch((err) => {
			console.error("Error running query...");
			console.error(err);
		}).then((res) => {
			result = '{"edges": ' + JSON.stringify(dataset.edges) + ",";
			result += '"vertices": ' + JSON.stringify(dataset.vertices) + "}";
			callback(result);
			qClient.close();
		}).catch((err) =>
			console.error("Fatal error:", err)
		);
};