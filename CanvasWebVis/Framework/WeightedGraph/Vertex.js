function Vertex(_id){
	this.id = _id;
}

Vertex.prototype.getAdjacentVertecies = function(_graph)
{
	//find all edges in _graph.edges that have this.id as source_vertex_id
	_edges = _graph.edges.filter(function(_edge){
		return this.id == _edge.source_vertex_id;
	}, this);

	_adjacent_vertecies = [];

	_edges.forEach(function(_edge){
		_adjacent_vertex = _graph.vertecies.filter(function(_vertex){
			return _vertex.id == _edge.dest_vertex_id;
		});	
		_adjacent_vertecies.push(_adjacent_vertex[0]);
	});
	
	return _adjacent_vertecies;
}

Vertex.prototype.getEdges = function(_graph)
{
	_edges = _graph.edges.filter(function(_edge){
		return this.id == _edge.source_vertex_id;
	}, this);

	return _edges;
}

Vertex.prototype.draw = function(_c)
{
	_c.beginPath();
	_c.arc(100,100,20,0,2*Math.PI);
	_c.stroke();
}