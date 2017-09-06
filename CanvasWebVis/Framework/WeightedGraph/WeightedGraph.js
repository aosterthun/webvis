// http://colorbrewer2.org/?type=sequential&scheme=PuRd&n=9

function WeightedGraph(_json_graph){
	this.id = _json_graph.id;
	this.vertecies = _json_graph.vertices;
	this.edges = _json_graph.edges;
	this.vertex_offset = 100;
	this.depth = _json_graph.depth;
	this.vertex_count_at_depth = _json_graph.vertex_count_at_depth;
	this.max_vertex_title_size_at_depth = [];
	this.vertex_rect_padding = 0;
}

WeightedGraph.prototype.containsVertexAtCoords = function(_coords)
{
	_vertex_at_coords = this.vertecies.filter(function(_vertex){
		return ((_vertex.coords.x_abs <= _coords.x) && (_vertex.coords.x_abs + _vertex.size) >= _coords.x) &&
				(((_vertex.coords.y_abs + (_vertex.font_size / 2)) >= _coords.y) && (_vertex.coords.y_abs) <= (_coords.y+ (_vertex.font_size / 2)));
	});

	console.log(_vertex_at_coords);

	// _vertex_at_coords = this.vertecies.filter(function(_vertex){
	// 	return (Math.pow((_coords.x - _vertex.coords.x_abs),2) + Math.pow((_coords.y - _vertex.coords.y_abs),2)) < Math.pow(_vertex.size,2);
	// 	//return coords >= (_vertex.coords == _coords;
	// });
	return _vertex_at_coords[0];
}


WeightedGraph.prototype.getAdjacentVertecies = function(_vertex)
{
	_adjacent_vertecies = [];

	this.edges.forEach(function(_edge){
		if ((_vertex.id == _edge.source_vertex_id) || (_vertex.id == _edge.dest_vertex_id))
		{
			_adjacent_vertecies.push(this.getVertexById(_edge.source_vertex_id));
			_adjacent_vertecies.push(this.getVertexById(_edge.dest_vertex_id));
		}
	},this);
	
	return _adjacent_vertecies;
}

WeightedGraph.prototype.getEdges = function(_vertex)
{
	_edges = this.edges.filter(function(_edge){
		return _vertex.id == _edge.source_vertex_id;
	}, this);

	return _edges;
}

WeightedGraph.prototype.getIncommingEdges = function(_vertex)
{
	_edges = [];

	this.edges.forEach(function(_edge){
		if (_vertex.id == _edge.source_vertex_id)
		{
			if(this.getVertexById(_edge.dest_vertex_id).coords.x <= _vertex.coords.x)
			{
				_edges.push(_edge);	
			}	
		}

		if (_vertex.id == _edge.dest_vertex_id)
		{
			if(this.getVertexById(_edge.source_vertex_id).coords.x <= _vertex.coords.x)
			{
				_edges.push(_edge);	
			}	
		}
	}, this);



	return _edges;
}

WeightedGraph.prototype.depth_first_search = function(_start_vertex, _visited, _callback)
{
	_visited.push(_start_vertex);
	_callback(_start_vertex);
	this.getAdjacentVertecies(_start_vertex).forEach(function(_adjacent_vertex){
		if(!~_visited.indexOf(_adjacent_vertex))
		{
			if(_adjacent_vertex.coords.x >= _start_vertex.coords.x)
			{
				this.depth_first_search(_adjacent_vertex,_visited,_callback);
			}
		}
	},this);	
}

WeightedGraph.prototype.sortByNumberOfIncomingEdges = function()
{
	// _edgeIncomeCount = {};
	// _edgeIncomeCount = [];
	// this.edges.forEach(function(_edge){

	// });
	// this.edges.forEach(function(_edge){
	// 	if (!(_edge.dest_vertex_id in _edgeIncomeCount))
	// 	{
	// 		_edgeIncomeCount[_edge.dest_vertex_id] = 0;
	// 	}
	// 	else
	// 	{
	// 		_edgeIncomeCount[_edge.dest_vertex_id] += 1;
	// 	}
	// });

	console.log(_edgeIncomeCount);
	Object.keys(_edgeIncomeCount).sort();
	console.log(_edgeIncomeCount);
	//_edgeIncomeCount.sort();
	//console.log(_edgeIncomeCount);
}

WeightedGraph.prototype.enable_abo_count_vis = function(_start_vertex,_visited)
{
	
	_start_vertex.color = "red";
	_start_vertex.highlight_state = true;
	this.getEdges(_start_vertex).forEach(function(_edge){
		_edge.color = "red";
	});
	_visited.push(_start_vertex);
	this.getAdjacentVertecies(_start_vertex).forEach(function(_adjacent_vertex){
		if(!~_visited.indexOf(_adjacent_vertex))
		{
			this.enable_abo_count_vis(_adjacent_vertex,_visited);
		}
	},this);	
}

WeightedGraph.prototype.disable_abo_count_vis = function(_start_vertex,_visited)
{
	
	_start_vertex.color = "white";
	_start_vertex.highlight_state = false;
	this.getEdges(_start_vertex).forEach(function(_edge){
		_edge.color = "white";
	});
	_visited.push(_start_vertex);
	this.getAdjacentVertecies(_start_vertex).forEach(function(_adjacent_vertex){
		if(!~_visited.indexOf(_adjacent_vertex))
		{
			console.log("test");
			this.disable_abo_count_vis(_adjacent_vertex,_visited);
		}
	},this);	
}

WeightedGraph.prototype.getVertexById = function(_vertex_id)
{
	return this.vertecies.filter(function(_vertex){return _vertex.id == _vertex_id})[0];
}

WeightedGraph.prototype.getGraphAsAdjacencyList = function()
{
	_start_vertecies = {};
	this.vertecies.forEach(function(_vertex){
		_start_vertecies[_vertex.id] = this.getAdjacentVertecies(_vertex);
	},this);
	
	return _start_vertecies;
}

WeightedGraph.prototype.setVertexDepth = function(_vertex,_depth)
{
	_vertex.depth = _depth;
	_vertex.coords.x = this.vertex_offset * _depth;
}

WeightedGraph.prototype.addVertex = function(_vertex,_depth)
{
	this.setVertexDepth(_vertex,_depth);
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
		_vertecies = this.getAdjacentVertecies(_vertex);

		var _dest_vertex_string = "";
		_vertecies.forEach(function(_vertex){
			_dest_vertex_string += _vertex.id + " | ";
		});

		console.log(_vertex.id + " -> " + _dest_vertex_string);
	}, this);
}

WeightedGraph.prototype.drawVertex = function(_vertex)
{
	//this.draw_settings.context.arc(_vertex.coords.x,_vertex.coords.y,_vertex.size,0,2*Math.PI);
	_font_size = (window.innerHeight) / (this.vertex_count_at_depth[_vertex.coords.x] + 1)
	console.log(_vertex.coords.x);
	if(_font_size > 16)
	{
		_font_size = 16;
	}

	
	// console.log(_vertex.color);
	
	
	this.draw_settings.context.beginPath();
	this.draw_settings.context.strokeStyle = "white";
	this.draw_settings.context.fillStyle = _vertex.color;
	this.draw_settings.context.lineWidth = _vertex.lineWidth;
	this.draw_settings.context.rect(_vertex.coords.x_abs,_vertex.coords.y_abs - (_font_size / 2),(((_font_size /1000) * 583) * this.max_vertex_title_size_at_depth[_vertex.coords.x]),_font_size);
	//_vertex.coords.x_abs = _vertex.coords.x_abs + ((_font_size /1000) * 583) * this.max_vertex_title_size_at_depth[_vertex.coords.x];
	_vertex.size = ((_font_size /1000) * 583) * this.max_vertex_title_size_at_depth[_vertex.coords.x];
	_vertex.font_size = _font_size;
	this.draw_settings.context.fill();
	
	this.draw_settings.context.lineWidth = 0;

	this.draw_settings.context.beginPath();
	this.draw_settings.context.font = _font_size + "px Arial"
	this.draw_settings.context.fillStyle = "black";
	this.draw_settings.context.fillText(_vertex.channel_data.title,_vertex.coords.x_abs,_vertex.coords.y_abs + (_font_size/2) - 2.5);
	this.draw_settings.context.fill();
}

WeightedGraph.prototype.drawEdge = function(_edge)
{
	_vertex_1 = this.getVertexById(_edge.source_vertex_id);
	_vertex_2 = this.getVertexById(_edge.dest_vertex_id);

	if(_vertex_1.coords.x >= _vertex_2.coords.x)
	{
		_source_vertex = _vertex_2
		_dest_vertex =  _vertex_1
	}
	else
	{
		_source_vertex = _vertex_1
		_dest_vertex =  _vertex_2	
	}

	_source_vertex_edges = this.getEdges(_source_vertex);
	_edge_number = _source_vertex_edges.indexOf(_edge);

	_even_number_of_edges = _source_vertex_edges.length % 2;
	_midpoint = _source_vertex_edges.length / 2;

	this.draw_settings.context.beginPath();
	//console.log(_source_vertex.coords.x);
	this.draw_settings.context.strokeStyle = _edge.color;
	_bezier_offset = {"x": 0, "y": 0};

	if (_source_vertex.coords.x == _dest_vertex.coords.x)
	{
		_bezier_offset.x = -this.vertex_offset/1.5;
		this.draw_settings.context.moveTo(_source_vertex.coords.x_abs,_source_vertex.coords.y_abs);
		
		this.draw_settings.context.bezierCurveTo(
						_source_vertex.coords.x_abs + _bezier_offset.x,
						_source_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs + _bezier_offset.x,
						_dest_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs,
						_dest_vertex.coords.y_abs);

		this.draw_settings.context.stroke();	
	}
	else
	{
		if(_edge_number < Math.floor(_midpoint,0))
		{
			//console.log("smaller");
			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			_bezier_offset.x = -this.vertex_offset/2;
			this.draw_settings.context.bezierCurveTo(_source_vertex.coords.x_abs+_source_vertex.size,
						_source_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs + _bezier_offset.x,
						_dest_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs,
						_dest_vertex.coords.y_abs);
			this.draw_settings.context.stroke();
		} 
		else if(_edge_number > Math.floor(_midpoint,0))
		{
			//console.log("bigger");
			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			_bezier_offset.x = -this.vertex_offset/2;
			this.draw_settings.context.bezierCurveTo(_source_vertex.coords.x_abs+_source_vertex.size,
						_source_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs + _bezier_offset.x,
						_dest_vertex.coords.y_abs,
						_dest_vertex.coords.x_abs,
						_dest_vertex.coords.y_abs);
			this.draw_settings.context.stroke();
		} 
		else if(_edge_number == Math.floor(_midpoint,0))
		{
			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			this.draw_settings.context.lineTo(_dest_vertex.coords.x_abs,_dest_vertex.coords.y_abs);
			this.draw_settings.context.stroke();
		} 
	}
	this.draw_settings.context.strokeStyle = 'black';
}

WeightedGraph.prototype.setDrawSettings = function(_draw_settings)
{
	this.draw_settings = _draw_settings;
}

WeightedGraph.prototype.calcVertexCoords = function()
{

	_font_size = (window.innerHeight) / (this.vertex_count_at_depth[this.depth] + 1)
	if(_font_size > 16)
	{
		_font_size = 16;
	}
	this.vertecies.forEach(function(_vertex){
		if(this.max_vertex_title_size_at_depth[_vertex.coords.x] == null)
		{
			this.max_vertex_title_size_at_depth[_vertex.coords.x] = _vertex.channel_data.title.length;
		}
		else if (_vertex.channel_data.title.length > this.max_vertex_title_size_at_depth[_vertex.coords.x])
		{
			this.max_vertex_title_size_at_depth[_vertex.coords.x] = _vertex.channel_data.title.length;
		}
	},this);
	this.vertecies.forEach(function(_vertex){

		_depth_vertex_count = this.vertex_count_at_depth[_vertex.coords.x];
		console.log("afd" + ((_vertex.font_size /1000) * 583));
		_init_x_offset = ((window.innerWidth - this.max_vertex_title_size_at_depth[this.depth] * ((_font_size /1000) * 583))) / (this.depth*2) ;
		_vertex.coords.x_abs = (_vertex.coords.x * (_init_x_offset * 2));
		_init_y_offset = ((window.innerHeight) / (_depth_vertex_count *2) );
		_vertex.coords.y_abs = _init_y_offset + (_vertex.coords.y * (_init_y_offset *2));

		_vertex.size = 10;
	},this);

	console.log(this.max_vertex_title_size_at_depth)
}

WeightedGraph.prototype.draw = function()
{
	console.log("[start]WeightedGraph.prototype.draw");

	this.vertecies.forEach(function(_vertex){
		this.drawVertex(_vertex);
	},this);

	this.edges.forEach(function(_edge){
		_dest_vertex = this.getVertexById(_edge.dest_vertex_id);
		if(!_dest_vertex.highlight_state)
		{
			this.drawEdge(_edge);
		}
	},this);

	

	this.edges.forEach(function(_edge){
		_dest_vertex = this.getVertexById(_edge.dest_vertex_id);
		if(_dest_vertex.highlight_state)
		{
			this.drawEdge(_edge);
		}
	},this);
	console.log("[end]WeightedGraph.prototype.draw");
}