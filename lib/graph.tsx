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
        this.vertexDeltas = [];
        for (let i in this.vertexes) {
            this.vertexDeltas.push(new Vector(0, 0));
        }
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
            this.vertexes[i].circle.pos = Vector.plus(
                this.vertexes[i].circle.pos, this.vertexDeltas[i]);
            this.vertexDeltas[i] = nilVector;
        }
        // calculate new edge distances
        this.edges.forEach((edge) =>
            edge.distance = Vector.dist(edge.parent.circle.pos, edge.child.circle.pos)
            - edge.parent.circle.radius - edge.child.circle.radius)
    }
    isParentOfEdge = (circle: Circle, edge: Edge): boolean => circle === edge.parent.circle;
    getVertexes = (circles: Circle[]): Vertex[] => {
        let vertexes: Vertex[] = []
        for (let i in circles) {
            vertexes.push({
                circle: circles[i], edges: this.edgesWithCircle(circles[i])
            })
            // vertexes.
        }
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
        return { circle: c, edges: [] }
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
    isThenClipping = (): void => this.edges.forEach((edge) => {
        // console.log(edge.distance)
        if (edge.distance <= 0)
            this.clippingPush(edge);
    });
    closestVertex = (v: Vertex): Vertex => v.edges[0].child
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
    static mean = (vertexes: Vertex[]): Vector => {
        // Reduces the vector list to the sum of the vertex positions, then
        // returns that value's division by the vector list's length, thus
        // returning the mean.
        return Vector.times(1 / vertexes.length,
            vertexes.reduce(((accumVector, v) =>
                Vector.plus(accumVector, v.circle.pos)), new Vector(0, 0)));
    }
    behaviorRun = (): void => this.vertexes.forEach((v) => v.circle.behave(v, this));

    // The thought process behind adding delta is that I'm going to reprocess
    // information in the vertexes loops anyways, so I'm missing a speed bonus
    // here slightly. Regardless, I want an immutable state, thus I am adding
    // deltas which will be processed at a different part of the game running
    // loop. That is, something like REPL (read eval print loop). I want there
    // to one consistent state which persists between the read, evaluate, and
    // print parts.
    clippingPush = (edge: Edge): void => {
        let dirTo = Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
        let multiplier = (1 - edge.distance) / 25 // edge.distance should be negative if clipping
        this.addDelta(
            this.indexOf(edge.parent),
            Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
    }
    indexOf = (vertex: Vertex): number => {
        for (let i in this.vertexes) {
            if (Vector.equalPosition(this.vertexes[i].circle.pos, vertex.circle.pos)) {
                return Number(i)
            }
        }
        return -1
    }
    indexOfCircle = (circle: Circle): number => {
        for (let i in this.vertexes) {
            if (Vector.equalPosition(this.vertexes[i].circle.pos, circle.pos))
                return Number(i)
        }
        return -1
    }

    // Just a note, perhaps, that it is more efficient to use the built-in
    // function drawImage instead of drawing the circles and filling them in at
    // every frame. However, this is sort of the least of my concerns , because
    // in the future static images may be used instead, and also the game has a
    // ridiculous amount of overhead at this point (2016-12-21, 835 lines of
    // code).
    drawVertexes = (): void => this.vertexes.forEach((v): void => this.drawCircle(v.circle))
    drawCircle = (circle: Circle): void => {
        if (!circle.alive)
            circle.color = 'gray'
        // Draw the Circle
        ctx.beginPath();
        ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
        ctx.closePath();
        // color in the circle
        ctx.fillStyle = circle.color;
        ctx.fill();
        // Draw the triangle at circle.direction at half radius. I think I'm going
        // to make all projectiles squares. Triangles could be designated as
        // structures.
        ctx.beginPath();
        // forward point
        ctx.moveTo(
            circle.pos.x + (3 * circle.radius / 4) * Math.sin(circle.direction),
            circle.pos.y + (3 * circle.radius / 4) * Math.cos(circle.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        ctx.lineTo(
            circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction + Math.PI / 3),
            circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction + Math.PI / 3));
        ctx.lineTo(
            circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction - Math.PI / 3),
            circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction - Math.PI / 3));
        // color it in
        ctx.fillStyle = circle.bandColor;
        ctx.fill();
        ctx.closePath();
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



