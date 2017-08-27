// http://colorbrewer2.org/?type=sequential&scheme=PuRd&n=9

function WeightedGraph(_id){
	this.id = _id;
	this.vertecies = [];
	this.edges = [];
	this.vertex_offset = 100;
	this.max_depth = 0;
}

WeightedGraph.prototype.depth_first_search = function(_start_vertex, _visited, _callback)
{
	_callback(_visited);
	_visited.push(_start_vertex);
	_start_vertex.getAdjacentVertecies(this).forEach(function(_adjacent_vertex){
		if(!~_visited.indexOf(_adjacent_vertex))
		{
			this.depth_first_search(_adjacent_vertex,_visited);
		}
	},this);	
}

WeightedGraph.prototype.highlight_from_vertex = function(_start_vertex,_visited)
{
	_start_vertex.color = "#ce1256"
	_visited.push(_start_vertex);
	_start_vertex.getAdjacentVertecies(this).forEach(function(_adjacent_vertex){
		if(!~_visited.indexOf(_adjacent_vertex))
		{
			this.highlight_from_vertex(_adjacent_vertex,_visited);
		}
	},this);	
}

WeightedGraph.prototype.getGraphAsAdjacencyList = function()
{
	_start_vertecies = [];
	this.vertecies.forEach(function(_vertex){
		_start_vertecies[_vertex.id] = _vertex.getAdjacentVertecies(this);
	},this);
	return _start_vertecies;
}

WeightedGraph.prototype.addVertex = function(_vertex,_depth)
{
	_vertex.setDepth(this,_depth);
	if (_depth > this.max_depth)
	{
		this.max_depth = _depth;
	}
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
		_vertex.draw(_c,this);
		_edges = _vertex.getEdges(this);

		_edges.forEach(function(_edge){
			_edge.draw(_c,this);
		},this);
		
	}, this);
}