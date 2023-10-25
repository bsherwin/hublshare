/*jshint esversion: 9 */

var simulation;
var height;
var width;
var graph = [];
graph.links = [];
graph.nodes = [];
var datasets = [];
var color = d3.scaleOrdinal(d3.schemeCategory10);

function onload () {
	fillDatasets();

	width = document.querySelector('#visualization').offsetWidth;
	height = document.querySelector('#visualization').offsetHeight;

	d3.selectAll('svg').remove();
	var visDiv = d3.select('#visualization');
	var svg = visDiv
		.append("svg")
		.attr("width", width - 30)
		.attr("height", height - 30);

	var g = svg.append('g').attr('class', 'svgGraph');
	let zoom = d3.zoom()
		.on("zoom", () => {
			g.attr("transform", d3.event.transform);
		});
	svg.call(zoom);
}

function fillDatasets() {
	let ddDatasets = document.getElementById('datasetlist');
	ddDatasets.length = 0;

	let defaultOption = document.createElement('option');
	defaultOption.text = 'Choose Dataset';
	ddDatasets.add(defaultOption);
	ddDatasets.selectedIndex = 0;

	const url = 'http://localhost:3000/datasets';

	const request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function () {
		if (request.status === 200) {
			const data = JSON.parse(request.responseText);
			datasets = data;
			let option;
			for (let i = 0; i < data.length; i++) {
				option = document.createElement('option');
				option.text = data[i].name;
				option.value = data[i].name;
				ddDatasets.add(option);
			}
		} else {
			// Reached the server, but it returned an error
		}
	};
	request.onerror = function () {
		console.error('An error occurred fetching the JSON from ' + url);
	};
	request.send();
}

function datasetlist_changed(ddlDatasetList) {
	var x = ddlDatasetList.selectedIndex - 1;

	btnClear_click();
	document.getElementById('query').value = "";

	document.getElementById('database').innerHTML = "Database: " + datasets[x].database;
	document.getElementById('collection').innerHTML = "Collection: " + datasets[x].collection;
	
	let ddQueries = document.getElementById('savedQueries');
	ddQueries.length = 0;
	
	let defaultOption = document.createElement('option');
	defaultOption.text = '';
	ddQueries.add(defaultOption);
	ddQueries.selectedIndex = 0;

	var queries = datasets[x].queries;
	for (let i = 0; i < queries.length; i++) {
		option = document.createElement('option');
		option.text = queries[i].display;
		option.value = queries[i].query;
		ddQueries.add(option);
	}
}

function savedQueries_changed (ddlQueries) {
	var queryText = ddlQueries.options[ddlQueries.selectedIndex].value;
	document.getElementById('query').value = queryText;
}

function btnClear_click () {
	var dropDown = d3.select('#label-list');
	dropDown.selectAll("option").remove();
	dropDown.classed("hidden", true);

	graph.links = [];
	graph.nodes = [];
	d3.select('.svgGraph').selectAll('g').remove();

	document.getElementById('details').innerHTML = "";
	document.getElementById('savedQueries').selectedIndex = -1;
}

function btnSubmit_click () {
	var datasetlist = document.getElementById('datasetlist');
	if (datasetlist.selectedIndex === 0) {
		alert('You must pick a dataset');
		return;
	}

	var query = document.getElementById('query').value;
	if (query === "") {
		alert('You must enter a query');
		return;
	}

	var x = datasetlist.selectedIndex - 1;
	var database = datasets[x].database;
	var collection = datasets[x].collection;

	var request = new XMLHttpRequest();
	body = 'query=' + query;
	body += '&database=' + database;
	body += '&collection=' + collection;
	// Open a new connection, using the GET request on the URL endpoint
	request.open('POST', '/', true);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			buildD3Graph(JSON.parse(request.response));
		}
	};
	request.send(body);
}

function buildD3Graph (rawData) {
	if (simulation) {
		simulation.stop();
	}

	links = rawData.edges.map(e => ({ id: e.id, label: e.label, source: e.outV, target: e.inV }));
	nodes = rawData.vertices;

	links.forEach(element => {
		if (graph.links.map(e => e.id).indexOf(element.id) == -1) {
			graph.links.push(element);
		}
	});
	nodes.forEach(element => {
		if (graph.nodes.map(e => e.id).indexOf(element.id) == -1) {
			graph.nodes.push(element);
		}
	});

	//add drop downs
	var dropDown = d3.select('#label-list');
	dropDown.selectAll("option").remove();
	var options = dropDown.selectAll("option")
		.data([... new Set(graph.nodes.map(data => data.label))].sort())
		.enter()
		.append('option')
		.text(d => d)
		.attr("value", d => d);
	dropDown.attr("size", options._groups[0].length);
	dropDown.classed("hidden", false);

	var svg = d3.select(".svgGraph");

	//add links
	var edges = svg.select('#edges');
	if (edges.empty()) {
		edges = svg.append('g').attr('id', 'edges');
	}
	var edgeLines = edges.selectAll("line")
		.data(graph.links);

	edgeLines.exit().remove();

	edgeLines = edgeLines.enter()
		.append("line")
		.attr("id", d => d.id)
		.style("stroke", "#ccc")
		.style("stroke-width", 1)
		.on("click", () => {
			var clickedLink = d3.event.currentTarget;
			var id = clickedLink.id;
			showEdgeDetails(id);
		})
		.merge(edgeLines);

	//add vertex points
	var vertices = svg.select('#vertices');
	if (vertices.empty()) {
		vertices = svg.append('g').attr('id', 'vertices');
	}
	var vertexGroup = vertices.selectAll(".vertex")
		.data(graph.nodes);

	vertexGroup.exit().remove();

	var enter = vertexGroup.enter().append("g").attr('class', 'vertex');

	enter.append('circle')
		.attr("id", d => d.id)
		.attr("r", 10)
		.style("fill", color(0))
		.on("click", () => {
			var clickedCircle = d3.event.currentTarget;
			var id = clickedCircle.id;
			document.getElementById('query').value = `g.V('id', '${id}').bothE().otherV().path()`;
			showNodeDetails(id);
		});

	var drag_handler = d3.drag()
		.on("start", dragStarted)
		.on("drag", dragged)
		.on("end", dragEnded);

	drag_handler(enter);

	enter.append("text")
		.attr('class', 'label')
		.attr('text-anchor', 'middle')
		.text(d => {
			if (d.properties.hasOwnProperty("name"))
				return d.properties.name[0].value;
			else
				return d.label;
		});

	enter.append("title")
		.text(d => {
			if (d.properties.hasOwnProperty("name"))
				return d.properties.name[0].value;
			else
				return d.label;
		});

	vertexGroup = vertexGroup.merge(enter);

	simulation = d3.forceSimulation(graph.nodes)
		.force("link", d3.forceLink(links).id(d => d.id).distance(200))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter().x(width / 2).y(height / 2));

	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

	simulation.force("link")
		.links(graph.links);

	colorNodes();

	function ticked () {
		edgeLines
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);
		vertexGroup
			.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
	}

	simulation.restart();
}

function colorNodes () {
	d3.selectAll('circle')
		.style('fill', (d, i) => {
			var labels = Array.from(d3.select('#label-list').selectAll('option')._groups[0]).map(elem => elem.label);
			return color(labels.indexOf(d.label));
		});
}

function dragStarted () {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d3.event.subject.fx = d3.event.subject.x;
	d3.event.subject.fy = d3.event.subject.y;
}

function dragged () {
	d3.event.subject.fx = d3.event.x;
	d3.event.subject.fy = d3.event.y;
}

function dragEnded (d) {
	selectedNode = d3.select(this).select('circle');
	if (!d3.event.active) simulation.alphaTarget(0);
	selectedNode.classed("pinned", true);
	if (!d3.event.sourceEvent.shiftKey) {
		selectedNode.classed("pinned", false);
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}
}

function showNodeDetails (id) {
	nodeDetail = graph.nodes.filter(e => e.id === id)[0];
	details = document.getElementById('details');
	details.innerHTML = "<h3>" + nodeDetail.label + "</h3>";
	details.innerHTML += nodeDetail.id + "</br>";
	details.innerHTML += JSON.stringify(nodeDetail.properties);
}

function showEdgeDetails (id) {
	edgeDetail = graph.links.filter(l => l.id === id)[0];
	details = document.getElementById('details');
	details.innerHTML = "<h3>" + edgeDetail.label + "</h3>";
	// details.innerHTML += edgeDetail.label + "</br>";
	// details.innerHTML += JSON.stringify(edgeDetail.properties);
}