// -*-mode:typescript-*-

/* Graph idea */
/*   A Graph G = (V, E) contains Vertices and Edges. The Vertexes correspond
 *   directly to the Circles, and the edges correspond to the simple distance
 *   between each of the vertices. I am going to use the notion of an edge being
 *   dirty to be an edge connecting two circles of different colors, and
 *   therefore a clean edge is an edge connecting two circles of same color. */

/*   Just as well, this is my first foray into functional programming for the
 *   project. */

interface Edge {
    p: Circle,                  // parent
    c: Circle,                  // child
    d: number                   // distance
}

interface Vertex {
    c: Circle,
    e: Edge[]
}


// Dirty edges and Clean edges
class Graph {
    vertexes: Vertex[];
    edges: Edge[];
    cEdges: Edge[];             // clean edges
    dEdges: Edge[];             // dirty edges

    constructor(circles: Circle[]) {
        this.edges = Graph.getEdges(circles);
        this.vertexes = this.getVertexes(circles);

        let vertexes = [],
            edges = this.edges;
        // for (let c of circles) {
        //     let edges = this.edges.filter(Graph.isEdgeOfVertex)
        //     this.vertexes[c].e.push(edges)
        // }
        // It should be less taxing sorting through half as many edges twice
        // instead of sorting on the big thing, then filtering.
        this.cEdges = Graph.sortedEdges(edges.filter(Graph.isClean));
        this.dEdges = Graph.sortedEdges(edges.filter(Graph.isDirty));
    }
    getVertexes = (circles: Circle[]): Vertex[] => {
        let vertexes: Vertex[] = []
        for (let c of circles) {
            // vertexes.push(vertexes.map(this.isEdgeOfVertex))
        }
        return
    }
    // This is an O(n^2) constructor function for edges
    static getEdges = (circles: Circle[]): Edge[] => {
        let edges: Edge[] = [];
        for (let p of circles) {     // parent
            for (let c of circles) { // child
                if (p !== c) {
                    let d = Vector.dist(p.c.pos, c.c.pos); // distance
                    edges.push({ p, c, d });
                }
            }
        }
        return edges
    };
    isEdgeOfVertex = (v: { c: Circle, e: Edge[] }): boolean => e.p === v.c
    // This sorting algorithm is the built-in one. The JavaScript developers are
    // probably really clever, so it's a strong bet this is pretty good to use.
    // However, in the future it may be worth investigating some time into if
    // that really is not the case! It would ideally operate close to an O(n)
    // function. Probably the upper bound is O(n*log(n)).
    static sortedEdges = (e: Edge[]): Edge[] => e.sort(Graph.compareDist);
    static produceEdge = (c1: Circle, c2: Circle): Edge => {
        return {
            p: c1,
            c: c2,
            d: Vector.dist(c1.pos, c2.pos)
        }
    };
    static compareDist = (e1: Edge, e2: Edge): number =>
        (Vector.dist(e1.c.pos, e1.p.pos)) - (Vector.dist(e2.c.pos, e2.p.pos))

    // I am going to segregate the type of the edge by comparing the difference
    // of the circles. If the colors of the circles are the same, then they are
    // called dirty. If the colors of the circles are different, then they are
    // called clean.
    smallestCEdge = (c1: Circle): Edge => this.cEdges[0]
    smallestDEdge = (c1: Circle): Edge => this.dEdges[0]
    static isDirty = (e: Edge): boolean => e.p.color !== e.c.color
    static isClean = (e: Edge): boolean => e.p.color === e.c.color

}
