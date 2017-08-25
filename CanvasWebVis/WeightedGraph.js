function WeightedGraph()
{
	this.graph = [];
}

function Vertex(_id,_x,_y)
{
	this.id = _id;
	this.x = _x;
	this.y = _y;
}

Vertex.prototype.draw = function(_context)
{
	_context.beginPath();
	_context.arc(this.x,this.y,40,0,2*Math.PI);
	_context.lineWidth=5;
	_context.stroke();	
};

function Edge(_weight,_adjacent_vertex)
{
	this.weight = _weight;
	this.adjacent_vertex = _adjacent_vertex
};

WeightedGraph.prototype.addVertex = function(_vertex)
{
	this.graph[_vertex.id] = new SinglyLinkedList();
	_edge = new Edge(0,_vertex);
	this.graph[_vertex.id].add(_edge);
};

WeightedGraph.prototype.addEdge = function(_vertex1,_vertex2,_weight)
{
	_edge = new Edge(_weight,_vertex2);
	this.graph[_vertex1.id].add(_edge);
	//this.graph[_vertex2.id].add(_edge);
};

WeightedGraph.prototype.print = function()
{
	console.log(_graph);
	this.graph.forEach(function(_vertex){
		_vertex.print();
	});
};

WeightedGraph.prototype.draw = function(_context)
{
	_context.lineWidth=1;			
	this.graph.forEach(function(_vertex){
		_context.lineWidth=1;			
		_context.beginPath();
		_context.arc(_vertex.head.data.adjacent_vertex.x,_vertex.head.data.adjacent_vertex.y,40,0,2*Math.PI);
		_context.lineWidth=1;
		_context.stroke();	
		_context.lineWidth=1;			
		_source_coords = {x: _vertex.head.data.adjacent_vertex.x , y: _vertex.head.data.adjacent_vertex.y};
		_vertex.traverse(function(_adjacent_vertex){
			_context.lineWidth=1;			
			_dest_coords = {x: _adjacent_vertex.data.adjacent_vertex.x, y: _adjacent_vertex.data.adjacent_vertex.y};
			_context.moveTo(_source_coords.x,_source_coords.y);
			_context.lineTo(_dest_coords.x,_dest_coords.y);
			_context.lineWidth=_adjacent_vertex.data.weight;
			_context.stroke();
			_context.lineWidth=1;			
		});
	});
};