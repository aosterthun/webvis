var _c = document.getElementById("canvas");
var _ctx = _c.getContext("2d");
var _graph = new WeightedGraph();

_vertex1 = new Vertex(1,100,100);
_vertex2 = new Vertex(2,300,400);
_vertex3 = new Vertex(3,500,100);
_vertex4 = new Vertex(4,200,400);

_graph.addVertex(_vertex1);
_graph.addVertex(_vertex2);
_graph.addVertex(_vertex3);
_graph.addVertex(_vertex4);

_graph.addEdge(_vertex1,_vertex2,1);
_graph.addEdge(_vertex2,_vertex3,1);
_graph.addEdge(_vertex2,_vertex4,1);
_graph.addEdge(_vertex4,_vertex1,5);

_graph.print();

_graph.draw(_ctx);