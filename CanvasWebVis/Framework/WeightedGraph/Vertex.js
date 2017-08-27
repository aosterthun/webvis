function Vertex(_id,_y){
	this.id = _id;
	this.coords = {"x": 0, "y": _y};
	this.size = 20;
	this.depth = 0;
	this.color = "white";
}

Vertex.prototype.setDepth = function(_graph,_depth)
{
	this.depth = _depth;
	this.coords.x = _graph.vertex_offset * _depth;
	console.log(this.coords.x);
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

Vertex.prototype.draw = function(_c,_graph)
{
	_vertecies_at_vertex_depth = _graph.edges.filter(function(_edge){return this.id == _edge.source_vertex_id},this);
	_vertecies_depth_count = _vertecies_at_vertex_depth.length;


	_c.beginPath();
	_c.arc(this.coords.x,this.coords.y,this.size,0,2*Math.PI);
	_c.fillStyle = this.color;
	_c.fill();
}