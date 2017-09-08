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
	this.default_color = "#C1C1C1";

	this.vertecies.forEach(function(_vertex){
		_vertex.vis_info = {
			"highlight_state": false,
			"found_at_depth": null
		}
		_vertex.color = COLOR_VERTEX;
		_vertex.stroke_color = COLOR_VERTEX;
	});

	this.edges.forEach(function(_edge){
		_edge.color = COLOR_EDGE;
	});
}

WeightedGraph.prototype.containsVertexAtCoords = function(_coords)
{
	_vertex_at_coords = this.vertecies.filter(function(_vertex){
		return ((_vertex.coords.x_abs <= _coords.x) && (_vertex.coords.x_abs + _vertex.size) >= _coords.x) &&
				(((_vertex.coords.y_abs + (_vertex.font_size / 2)) >= _coords.y) && (_vertex.coords.y_abs) <= (_coords.y+ (_vertex.font_size / 2)));
	});


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
		if (_vertex.id == _edge.source_vertex_id)
		{
			_adjacent_vertecies.push(this.getVertexById(_edge.dest_vertex_id));
		}
		else if(_vertex.id == _edge.dest_vertex_id)
		{
			_adjacent_vertecies.push(this.getVertexById(_edge.source_vertex_id));
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

WeightedGraph.prototype.getOutgoingEdges = function(_vertex)
{
	_edges = [];

	this.edges.forEach(function(_edge){
		if (_vertex.id == _edge.source_vertex_id)
		{
			if(this.getVertexById(_edge.dest_vertex_id).coords.x >= _vertex.coords.x)
			{
				_edges.push(_edge);	
			}	
		}

		if (_vertex.id == _edge.dest_vertex_id)
		{
			if(this.getVertexById(_edge.source_vertex_id).coords.x >= _vertex.coords.x)
			{
				_edges.push(_edge);	
			}	
		}
	}, this);

	return _edges;
}

WeightedGraph.prototype.reset = function()
{
	this.vertecies.forEach(function(_vertex){
		_vertex.color = COLOR_VERTEX;
		_vertex.stroke_color = COLOR_VERTEX;
		_vertex.vis_info.highlight_state = false;
	},this);

	this.edges.forEach(function(_edge){
		_edge.color = COLOR_EDGE;
	},this);
}

WeightedGraph.prototype.depth_search = function(_start_vertex,_depth,_from_start)
{
	_current_depth = 0;
	_visited = [];

	_current = [_start_vertex.id];
	while(_current_depth < _depth){
		//console.log("depth: " + _current_depth);
		_next = [];
		_current.forEach(function(_id){
			if(!~_visited.indexOf(_id))
			{
				_visited.push(_id);
				vertex = this.getVertexById(_id);
				vertex.vis_info.found_at_depth = _current_depth;
				_adjacent_vertices = this.getAdjacentVertecies(vertex);

				if(_from_start == true){
					_adjacent_vertices = _adjacent_vertices.filter(function(adjacent_vertex){
						return adjacent_vertex.coords.x >= vertex.coords.x;
					},this);
				}

				_next = _next.concat(_adjacent_vertices.map(function(_adjacent_vertex){return _adjacent_vertex.id})
											.filter(function(_id){ return (!~_visited.indexOf(_id))}));
			}
		},this);
		_current = _next;
		_current_depth++;
	}
	return _visited;
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

WeightedGraph.prototype.drawVertex = function(_vertex)
{
	
	_font_size = (window.innerHeight) / (this.vertex_count_at_depth[_vertex.coords.x] + 1);
	if(_font_size > 16)
	{
		_font_size = 16;
	}

	this.draw_settings.context.beginPath();
	this.draw_settings.context.strokeStyle = _vertex.stroke_color;
	this.draw_settings.context.fillStyle = _vertex.color;
	this.draw_settings.context.lineWidth = _vertex.lineWidth;
	this.draw_settings.context.rect(_vertex.coords.x_abs,_vertex.coords.y_abs - (_font_size / 2),(((_font_size /1000) * 583) * this.max_vertex_title_size_at_depth[_vertex.coords.x]),_font_size);
	_vertex.size = ((_font_size /1000) * 583) * this.max_vertex_title_size_at_depth[_vertex.coords.x];
	_vertex.font_size = _font_size;
	this.draw_settings.context.fill();
	if(_vertex.stroke_color != COLOR_VERTEX)
	{
		this.draw_settings.context.lineWidth = 3;
		this.draw_settings.context.stroke();
		this.draw_settings.context.lineWidth = 1;
	}
	

	
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

	_bezier_offset = {"x": 0, "y": 0};
	var xStart, yStart, cp1x, cp1y, cp2x, cp2y, xEnd, yEnd;

	if (_source_vertex.coords.x == _dest_vertex.coords.x)
	{
		_bezier_offset.x = -this.vertex_offset/1.5;

		this.draw_settings.context.moveTo(_source_vertex.coords.x_abs,_source_vertex.coords.y_abs);
		
		cp1x = _source_vertex.coords.x_abs + _bezier_offset.x;
		cp1y = _source_vertex.coords.y_abs;
		cp2x = _dest_vertex.coords.x_abs + _bezier_offset.x;
		cp2y =_dest_vertex.coords.y_abs;
		xEnd =_dest_vertex.coords.x_abs;
		yEnd = _dest_vertex.coords.y_abs;

	}
	else
	{
		if(_edge_number < Math.floor(_midpoint,0))
		{
			//console.log("smaller");
			_bezier_offset.x = -this.vertex_offset/2;

			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			
			cp1x = _source_vertex.coords.x_abs+_source_vertex.size;
			cp1y = _source_vertex.coords.y_abs;
			cp2x = _dest_vertex.coords.x_abs + _bezier_offset.x;
			cp2y = _dest_vertex.coords.y_abs;
			xEnd = _dest_vertex.coords.x_abs;
			yEnd =_dest_vertex.coords.y_abs;

		} 
		else if(_edge_number > Math.floor(_midpoint,0))
		{
			//console.log("bigger");
			_bezier_offset.x = -this.vertex_offset/2;

			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			
			cp1x = _source_vertex.coords.x_abs+_source_vertex.size;
			cp1y =_source_vertex.coords.y_abs;
			cp2x = _dest_vertex.coords.x_abs + _bezier_offset.x;
			cp2y = _dest_vertex.coords.y_abs;
			xEnd = _dest_vertex.coords.x_abs;
			yEnd = _dest_vertex.coords.y_abs;

		} 
		else if(_edge_number == Math.floor(_midpoint,0))
		{
			this.draw_settings.context.moveTo(_source_vertex.coords.x_abs + _source_vertex.size,_source_vertex.coords.y_abs);
			
			cp1x = _source_vertex.coords.x_abs+_source_vertex.size;
			cp1y =_source_vertex.coords.y_abs;
			cp2x = _dest_vertex.coords.x_abs;
			cp2y = _dest_vertex.coords.y_abs;
			xEnd = _dest_vertex.coords.x_abs;
			yEnd = _dest_vertex.coords.y_abs;
		} 
	}

	this.draw_settings.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, _dest_vertex.coords.x_abs, _dest_vertex.coords.y_abs);

	var my_gradient= this.draw_settings.context.createLinearGradient(_source_vertex.coords.x_abs,_source_vertex.coords.y_abs, _dest_vertex.coords.x_abs,_dest_vertex.coords.y_abs);

	gradient = true;

	if(gradient){

		if(_source_vertex.vis_info.highlight_state && _dest_vertex.vis_info.highlight_state){
			my_gradient.addColorStop(0,_source_vertex.color);
			my_gradient.addColorStop(1,_dest_vertex.color);
		}
		else{
			my_gradient.addColorStop(0,_edge.color);
			my_gradient.addColorStop(1,_edge.color);
		}
	}else{
		my_gradient.addColorStop(0,_source_vertex.color);
		my_gradient.addColorStop(0,_edge.color);
	}

	this.draw_settings.context.strokeStyle = my_gradient;
	this.draw_settings.context.stroke();
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
		//console.log("afd" + ((_vertex.font_size /1000) * 583));
		_init_x_offset = ((window.innerWidth - this.max_vertex_title_size_at_depth[this.depth] * ((_font_size /1000) * 583))) / (this.depth*2) ;
		_vertex.coords.x_abs = (_vertex.coords.x * (_init_x_offset * 2));
		_init_y_offset = ((window.innerHeight) / (_depth_vertex_count *2) );
		_vertex.coords.y_abs = _init_y_offset + (_vertex.coords.y * (_init_y_offset *2));

		_vertex.size = 10;
	},this);

	//console.log(this.max_vertex_title_size_at_depth)
}

WeightedGraph.prototype.draw = function()
{
	//console.log("[start]WeightedGraph.prototype.draw");

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
	//console.log("[end]WeightedGraph.prototype.draw");
}