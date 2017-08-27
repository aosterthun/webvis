function Edge(_id,_source_vertex_id,_dest_vertex_id,_weight){
	this.id = _id;
	this.source_vertex_id = _source_vertex_id;
	this.dest_vertex_id = _dest_vertex_id;
	this.weight = _weight;
}

Edge.prototype.draw = function(_c,_graph)
{
	_source_vertex = _graph.vertecies.filter(function(_vertex){return _vertex.id == this.source_vertex_id},this)[0];
	_dest_vertex = _graph.vertecies.filter(function(_vertex){return _vertex.id == this.dest_vertex_id},this)[0];
	
	_source_vertex_edges = _source_vertex.getEdges(_graph);
	_edge_number = _source_vertex_edges.indexOf(this);

	_even_number_of_edges = _source_vertex_edges.length % 2;
	_midpoint = _source_vertex_edges.length / 2;

	console.log(_edge_number);
	console.log(Math.floor(_midpoint,0));


	_c.beginPath();
	_c.moveTo(_source_vertex.coords.x+_source_vertex.size,_source_vertex.coords.y);
	_c.strokeStyle = 'white';
	_bezier_offset = {"x": 0, "y": 0};
	if(_edge_number < Math.floor(_midpoint,0)){
		_bezier_offset.x = -_graph.vertex_offset/2;	
		_c.bezierCurveTo(_source_vertex.coords.x+_source_vertex.size,
					_source_vertex.coords.y,
					_dest_vertex.coords.x + _bezier_offset.x,
					_dest_vertex.coords.y + _bezier_offset.y,
					_dest_vertex.coords.x-_dest_vertex.size,
					_dest_vertex.coords.y);
		_c.stroke();
	} else if(_edge_number > Math.floor(_midpoint,0)){
		console.log("bigger");
		_bezier_offset.x = -_graph.vertex_offset/2;
		_c.bezierCurveTo(_source_vertex.coords.x+_source_vertex.size,
					_source_vertex.coords.y,
					_dest_vertex.coords.x + _bezier_offset.x,
					_dest_vertex.coords.y + _bezier_offset.y,
					_dest_vertex.coords.x-_dest_vertex.size,
					_dest_vertex.coords.y);
		_c.stroke();
	} else if(_edge_number == Math.floor(_midpoint,0)){
		_c.lineTo(_dest_vertex.coords.x-_dest_vertex.size,_dest_vertex.coords.y);
		_c.stroke();
	}
	_c.strokeStyle = 'black';
}