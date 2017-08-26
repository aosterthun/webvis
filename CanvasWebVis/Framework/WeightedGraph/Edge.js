function Edge(_id,_source_vertex_id,_dest_vertex_id,_weight){
	this.id = _id;
	this.source_vertex_id = _source_vertex_id;
	this.dest_vertex_id = _dest_vertex_id;
	this.weight = _weight;
}

Edge.prototype.draw = function(_c)
{
	_c.beginPath();
	_c.moveTo(100,100);
	_c.bezierCurveTo(20,100,200,100,200,20);
	_c.stroke();
}