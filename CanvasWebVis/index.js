var callback = function(){
	var _graph = new WeightedGraph(1);

	var _vertex1 = new Vertex(1);
	var _vertex2 = new Vertex(2);
	var _vertex3 = new Vertex(3);
	var _vertex4 = new Vertex(4);

	_graph.addVertex(_vertex1);
	_graph.addVertex(_vertex2);
	_graph.addVertex(_vertex3);
	_graph.addVertex(_vertex4);

	_graph.addEdge(new Edge(1,1,2,1));
	_graph.addEdge(new Edge(2,1,3,1));
	_graph.addEdge(new Edge(3,2,3,1));
	_graph.addEdge(new Edge(4,3,4,1));
	_graph.addEdge(new Edge(5,3,1,1));
	_graph.addEdge(new Edge(6,4,1,1));

	_graph.print();

	var canvas = document.getElementById("graph");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var c = canvas.getContext("2d");
	_graph.draw(c);

};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
	callback();
} 
else
{
	document.addEventListener("DOMContentLoaded", callback);
}