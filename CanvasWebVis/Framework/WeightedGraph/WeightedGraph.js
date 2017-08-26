function WeightedGraph(_id){
	this.id = _id;
	this.vertecies = [];
	this.edges = [];
}

WeightedGraph.prototype.addVertex = function(_vertex)
{
	this.vertecies.push(_vertex);
}

WeightedGraph.prototype.addEdge = function(_edge)
{
	this.edges.push(_edge);
}

WeightedGraph.prototype.print = function()
{
	this.vertecies.forEach(function(_vertex){
		_vertecies = _vertex.getAdjacentVertecies(this);

		var _dest_vertex_string = "";
		_vertecies.forEach(function(_vertex){
			_dest_vertex_string += _vertex.id + " | ";
		});

		console.log(_vertex.id + " -> " + _dest_vertex_string);
	}, this);
}

WeightedGraph.prototype.draw = function(_c)
{
	this.vertecies.forEach(function(_vertex){
		_vertex.draw(_c);
		_edges = _vertex.getEdges(this);

		_edges.forEach(function(_edge){
			_edge.draw(_c);
		});
		
	}, this);
}