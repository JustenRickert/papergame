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
    parent: Vertex,             // parent
    child: Vertex,              // child
    distance: number            // distance
}

interface Vertex {
    circle: Circle,
    edges: Edge[]
}

// Dirty edges and Clean edges
class Graph {
    vertexes: Vertex[];
    vertexDeltas: Vector[];
    edges: Edge[];
    cEdges: Edge[];             // clean edges
    dEdges: Edge[];             // dirty edges

    constructor(circles: Circle[]) {
        this.edges = Graph.sortedEdges(Graph.getEdges(circles));
        this.vertexes = this.getVertexes(circles);
        this.vertexDeltas = new Vector(0, 0)[this.vertexes.length];
        this.cEdges = this.edges.filter(Graph.isClean);
        this.dEdges = this.edges.filter(Graph.isDirty);
    }
    // I can't figure out how to do this with map... There might be performance
    // increases in using map instead of iterating over the array.
    //
    // Sums the delta with current position, then resets the delta.
    sumResetDelta = (): void => {
        // let i = 0; i < this.vertexes.length; i++
        let nilVector = new Vector(0, 0);
        for (let i in this.vertexes) {
            if (this.vertexDeltas[i] === nilVector) {
                this.vertexes[i].circle.pos = Vector.plus(
                    this.vertexes[i].circle.pos, this.vertexDeltas[i]);
                this.vertexDeltas[i] = nilVector;
            }
        }
    }
    isParentOfEdge = (circle: Circle, edge: Edge): boolean => circle === edge.parent.circle;
    getVertexes = (circles: Circle[]): Vertex[] => {
        let vertexes: Vertex[] = []
        for (let i in circles) {
            console.log(this.edgesWithCircle(circles[i]))
            vertexes.push({
                circle: circles[i], edges: this.edgesWithCircle(circles[i])
            })
            // vertexes.
        }
        // console.log('vert', vertexes);
        // console.log('edge', this.edges);
        return vertexes;
    }
    addDelta = (index: number, v: Vector): void => {
        this.vertexDeltas[index] = Vector.plus(this.vertexDeltas[index], v);
    }
    static getEdges = (circles: Circle[]): Edge[] => {
        let edges: Edge[] = [];
        for (let parent of circles) {     // parent
            for (let child of circles) { // child
                let edge: Edge = Graph.produceEdge(
                    { circle: parent, edges: [] },
                    { circle: child, edges: [] });
                if (parent !== child) {
                    edges.push(edge);
                }
            }
        }
        for (let i in edges) {
            edges[i].distance =
                Vector.dist(edges[i].parent.circle.pos, edges[i].child.circle.pos)
                - edges[i].parent.circle.radius - edges[i].child.circle.radius

        }
        // console.log('getEdges', edges);
        return edges;
    }
    edgesWithCircle = (c: Circle): Edge[] => {
        return this.edges.filter(this.isParentOfEdge.bind(this, c));
    }
    // This sorting algorithm is the built-in one. The JavaScript developers are
    // probably really clever, so it's a strong bet this is pretty good to use.
    // However, in the future it may be worth investigating some time into if
    // that really is not the case! It would ideally operate close to an O(n)
    // function. Probably the upper bound is O(n*log(n)).
    static sortedEdges = (edges: Edge[]): Edge[] => edges.sort(Graph.compareDist)
    // I don't use this I think...
    static produceVertex = (c: Circle): Vertex => {
        return {
            circle: c,
            edges: []
        }
    }
    static produceEdge = (v1: Vertex, v2: Vertex): Edge => {
        return {
            parent: v1,
            child: v2,
            distance: Vector.dist(v1.circle.pos, v2.circle.pos)
        };
    }
    static compareDist = (e1: Edge, e2: Edge): number => e1.distance - e2.distance
    // I am going to segregate the type of the edge by comparing the difference
    // of the circles. If the colors of the circles are the same, then they are
    // called dirty. If the colors of the circles are different, then they are
    // called clean.
    smallestCEdge = (c1: Circle): Edge => this.cEdges[0]
    smallestDEdge = (c1: Circle): Edge => this.dEdges[0]
    static isDirty = (e: Edge): boolean => e.parent.circle.color !== e.child.circle.color
    static isClean = (e: Edge): boolean => e.parent.circle.color === e.child.circle.color
    // collision
    isThenClipping = (): void => {
        for (let e of this.edges) {
            if (e.distance <= e.child.circle.radius + e.parent.circle.radius)
                this.clippingPush(e);
        }
    }
    closestVertex = (v: Vertex): Vertex => v.edges[0].child
    draw = (): void => {
        for (let v of this.vertexes) {
            v.circle.draw();
        }
    }
    closestDirtyVertex = (v: Vertex): Vertex => v.edges.filter(Graph.isDirty)[0].parent
    closestDirtyVertexes = (v: Vertex, n: number): Vertex[] => {
        if (n > v.edges.length) { n = v.edges.length }
        else if (n < 0) { n = 0 }
        return v.edges.filter(Graph.isDirty).slice(0, n).map((edge) => edge.child)
    }
    closestCleanVertex = (v: Vertex): Vertex => v.edges.filter(Graph.isClean)[0].parent
    closestCleanVertexes = (v: Vertex, n: number): Vertex[] => {
        if (n > v.edges.length) { n = v.edges.length }
        else if (n < 0) { n = 0 }
        return v.edges.filter(Graph.isClean).slice(0, n).map((edge) => edge.child)
    }
    moment = (vertexes: Vertex[]): Vector => {
        let vector = new Vector(0, 0);
        for (let v of vertexes) {
            vector = Vector.plus(vector, v.circle.pos)
        }
        return
    }
    behave = (): void => {
        for (let i in this.vertexes) {
            this.vertexes[i].circle.behave(this.vertexes[i], this)
        }
    }
    // The thought process behind adding delta is that I'm going to reprocess
    // information in the vertexes loops anyways, so I'm missing a speed bonus
    // here slightly. Regardless, I want an immutable state, thus I am adding
    // deltas which will be processed at a different part of the game running
    // loop. That is, something like REPL (read eval print loop). I want there
    // to one consistent state which persists between the read, evaluate, and
    // print parts.
    clippingPush = (edge: Edge): void => {
        let dirTo = Vector.minus(edge.child.circle.pos, edge.child.circle.pos);
        let multiplier = 1 - edge.distance // edge.distance should be negative if clipping
        this.addDelta(
            this.vertexes.indexOf(edge.parent),
            Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
    }
}

interface Graph {
    stats: Statistics,
}

class Statistics {
    moment = (vertexes: Vertex[]) => {
        let totalVec = new Vector(0, 0);
        for (let v of vertexes) {
            totalVec = Vector.plus(v.circle.pos, totalVec);
        }
        return Vector.times(1 / vertexes.length, totalVec);
    }
}


var TEST_CIRCLES: Circle[] = [];
for (let i = 0; i < 10; i++) {
    TEST_CIRCLES.push(new RedCircle(i));
    TEST_CIRCLES[i].position(12 + i, 12 + i);
}
var graph = new Graph(TEST_CIRCLES);
testGameLoop();

function testGameLoop() {
    graph.behave();
    graph.isThenClipping();
    graph.draw();
    graph.sumResetDelta();
    requestAnimationFrame(testGameLoop);
}

