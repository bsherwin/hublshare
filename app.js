/*jshint esversion: 9 */

const express = require('express');
const config = require('./config');
const app = express();
const port = 3000;
const mapper = require('./cosmosgremlin');

/*add views*/
var data = require('./views/data');
app.use('/data', data);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', (req, res) => {
	query = req.body.query;
	database = req.body.database;
	collection = req.body.collection;
	console.log("Query: " + query);
	mapper.runQuery(query, database, collection, (result) => res.send(result));
});

app.get('/datasets', (req, res) => {
	res.header("Content-Type", "text/json");
	res.send(JSON.stringify(config.datasets));
});


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});