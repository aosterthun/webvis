var callback = function(){
	var _graph = new WeightedGraph(1);

	var _vertex1 = new Vertex(1,600); //offset * nth_vertex_at_depth * depth (400)
	var _vertex2 = new Vertex(2,400); //offset * nth_vertex_at_depth * depth (300)
	var _vertex3 = new Vertex(3,600); //offset * nth_vertex_at_depth * depth (true)
	var _vertex4 = new Vertex(4,700); //offset * nth_vertex_at_depth * depth (600)
	var _vertex5 = new Vertex(5,200); //offset * nth_vertex_at_depth * depth (true)
	var _vertex6 = new Vertex(6,400); //offset * nth_vertex_at_depth * depth (true)
	var _vertex7 = new Vertex(7,500); //offset * nth_vertex_at_depth * depth (600)
	var _vertex8 = new Vertex(8,100); //offset (true)
	var _vertex9 = new Vertex(9,200); //offset * nth_vertex_at_depth (true)
	var _vertex10 = new Vertex(10,300); //offset * nth_vertex_at_depth (true)

	_graph.addVertex(_vertex1,1);
	_graph.addVertex(_vertex2,2);
	_graph.addVertex(_vertex3,2);
	_graph.addVertex(_vertex4,2);
	_graph.addVertex(_vertex5,3);
	_graph.addVertex(_vertex6,3);
	_graph.addVertex(_vertex7,3);
	_graph.addVertex(_vertex8,4);
	_graph.addVertex(_vertex9,4);
	_graph.addVertex(_vertex10,4);

	_graph.addEdge(new Edge(1,1,2,1));
	_graph.addEdge(new Edge(2,1,3,1));
	_graph.addEdge(new Edge(3,1,4,1));
	_graph.addEdge(new Edge(4,2,5,1));
	_graph.addEdge(new Edge(5,2,6,1));
	_graph.addEdge(new Edge(6,2,7,1));
	_graph.addEdge(new Edge(7,5,8,1));
	_graph.addEdge(new Edge(8,5,9,1));
	_graph.addEdge(new Edge(9,5,10,1));
	//_graph.addEdge(new Edge(9,10,3,1));
	
	_graph.print();
	console.log(_graph.getGraphAsAdjacencyList());
	/*_graph.depth_first_search(_vertex1,[],test = function(_visited){
		console.log(_visited);
	});*/

	var canvas = document.getElementById("graph");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var c = canvas.getContext("2d");
	_graph.highlight_from_vertex(_vertex1,[]);
	_graph.draw(c);

	c.beginPath();
	c.strokeStyle = "white";
	c.moveTo(_vertex3.coords.x + _vertex3.size,_vertex3.coords.y)
	c.bezierCurveTo(_vertex2.coords.x,_vertex2.coords.y-150,_vertex10.coords.x-100-_vertex2.size - _vertex10.size,_vertex10.coords.y,_vertex10.coords.x - _vertex3.size, _vertex10.coords.y);
	c.stroke();

};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
	callback();
} 
else
{
	document.addEventListener("DOMContentLoaded", callback);
}