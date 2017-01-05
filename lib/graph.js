// -*-mode:typescript-*-
TEST_GRAPH = new Graph();
// Dirty edges and Clean edges
var Graph = (function () {
    function Graph(circles) {
        var _this = this;
        this.getVertexes = function (circles) {
            var vertexes = [];
            for (var _i = 0, circles_1 = circles; _i < circles_1.length; _i++) {
                var c = circles_1[_i];
            }
            return;
        };
        this.isEdgeOfVertex = function (v) { return e.p === v.c; };
        // I am going to segregate the type of the edge by comparing the difference
        // of the circles. If the colors of the circles are the same, then they are
        // called dirty. If the colors of the circles are different, then they are
        // called clean.
        this.smallestCEdge = function (c1) { return _this.cEdges[0]; };
        this.smallestDEdge = function (c1) { return _this.dEdges[0]; };
        this.edges = Graph.getEdges(circles);
        this.vertexes = this.getVertexes(circles);
        var vertexes = [];
        var edges = this.edges;
        // for (let c of circles) {
        //     let edges = this.edges.filter(Graph.isEdgeOfVertex)
        //     this.vertexes[c].e.push(edges)
        // }
        // It should be less taxing sorting through half as many edges twice
        // instead of sorting on the big thing, then filtering.
        this.cEdges = Graph.sortedEdges(edges.filter(Graph.isClean));
        this.dEdges = Graph.sortedEdges(edges.filter(Graph.isDirty));
    }
    return Graph;
}());
// This is an O(n^2) constructor function for edges
Graph.getEdges = function (circles) {
    var edges = [];
    for (var _i = 0, circles_2 = circles; _i < circles_2.length; _i++) {
        var p = circles_2[_i];
        for (var _a = 0, circles_3 = circles; _a < circles_3.length; _a++) {
            var c = circles_3[_a];
            if (p !== c) {
                var d = Vector.dist(p.c.pos, c.c.pos); // distance
                edges.push({ p: p, c: c, d: d });
            }
        }
    }
    return edges;
};
// This sorting algorithm is the built-in one. The JavaScript developers are
// probably really clever, so it's a strong bet this is pretty good to use.
// However, in the future it may be worth investigating some time into if
// that really is not the case! It would ideally operate close to an O(n)
// function. Probably the upper bound is O(n*log(n)).
Graph.sortedEdges = function (e) { return e.sort(Graph.compareDist); };
Graph.produceEdge = function (c1, c2) {
    return {
        p: c1,
        c: c2,
        d: Vector.dist(c1.pos, c2.pos)
    };
};
Graph.compareDist = function (e1, e2) {
    return (Vector.dist(e1.c.pos, e1.p.pos)) - (Vector.dist(e2.c.pos, e2.p.pos));
};
Graph.isDirty = function (e) { return e.p.color !== e.c.color; };
Graph.isClean = function (e) { return e.p.color === e.c.color; };
