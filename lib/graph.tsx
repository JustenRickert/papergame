// -*-mode:typescript-*-

/* Graph idea */

interface Edge {
    parent: Vertex,
    child: Vertex,
    dist: number
}

interface Vertex {
    circle: Circle,
    edges: Edge[]
}

class Graph {
    vertexes: Vertex[];
    vertexDeltas: Vector[] = [];
    edges: Edge[];
    player: Player;

    size: { height: number, width: number };
    collisionBucket: CollisionBucket;

    constructor(player: Player) {
        let nilVector = new Vector(0, 0);
        this.player = player;
        this.edges = Graph.sortedEdges(Graph.getEdges(player.circles));
        this.vertexes = this.getVertexes(player.circles);
        for (let i in this.vertexes) {
            this.vertexDeltas[i] = nilVector;
        }
        this.size = { height: canvas.height, width: canvas.width };
        this.collisionBucket = new CollisionBucket(this);
    }

    gridIndexOf = (vertex: Vertex, line: { x: number[], y: number[] }):
        { x: string, y: string } => {
        let x: string;
        let y: string;
        for (let i = 1; i <= line.x.length; i++) {
            if (vertex.circle.pos.x < line.x[i]) {
                x = String(i - 1);
                break;
            }
        }
        for (let i = 1; i <= line.y.length; i++) {
            if (vertex.circle.pos.x < line.x[i]) {
                y = String(i - 1);
                break;
            }
        }
        if (!x) x = String(line.x.length);
        if (!y) y = String(line.y.length);
        return { x, y }
    }

    // Sums the delta with current position, then resets the delta.
    sumResetDelta = (): void => {
        // let i = 0; i < this.vertexes.length; i++
        let nilVector = new Vector(0, 0);
        for (let i in this.vertexes) {
            this.vertexes[i].circle.pos = Vector.plus(
                this.vertexes[i].circle.pos, this.vertexDeltas[i]);
            this.vertexDeltas[i] = nilVector;
        }
        // calculate new edge distances & sort
        for (let i in this.edges) {
            this.edges[i].dist =
                Vector.distance(this.edges[i].parent.circle.pos, this.edges[i].child.circle.pos)
                - this.edges[i].parent.circle.radius
                - this.edges[i].child.circle.radius;
        }
        this.edges = Graph.sortedEdges(this.edges);
        // place new edges inside of vertexes
        for (let i in this.vertexes) {
            this.vertexes[i].edges = this.edgesWithCircle(this.vertexes[i].circle);
        }
    }

    isParentOfEdge = (circle: Circle, edge: Edge): boolean =>
        circle === edge.parent.circle;

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
        for (let parent of circles) {
            for (let child of circles) {
                let edge: Edge = Graph.produceEdge(
                    { circle: parent, edges: [] },
                    { circle: child, edges: [] });
                if (parent !== child) {
                    edges.push(edge);
                }
            }
        }
        for (let i in edges) {
            edges[i].dist =
                Vector.distance(edges[i].parent.circle.pos, edges[i].child.circle.pos)
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
            dist: Vector.distance(v1.circle.pos, v2.circle.pos)
        };
    }

    static compareDist = (e1: Edge, e2: Edge): number => e1.dist - e2.dist

    static isDirty = (e: Edge): boolean =>
        e.parent.circle.color !== e.child.circle.color;

    static isClean = (e: Edge): boolean =>
        e.parent.circle.color === e.child.circle.color;

    // collision
    isThenClipping = (): void => {
        // So, this.edges is ordered, meaning when we stop finding colliding
        // edges, there won't be anymore colliding edges.
        for (let e of this.edges) {
            if (e.dist <= 0)
                this.clippingPush(e);
            else
                break
        }
    }


    closestVertex = (v: Vertex): Vertex => v.edges[0].child;

    closestDirtyVertex = (v: Vertex): Vertex => {
        return v.edges.filter(Graph.isDirty)[0].child;
    }

    closestDirtyVertexes = (v: Vertex, n: number): Vertex[] => {
        if (n > v.edges.length) { n = v.edges.length }
        else if (n < 0) { n = 0 }
        return v.edges.filter(Graph.isDirty).slice(0, n).map((edge) => edge.child)
    }

    closestCleanVertex = (v: Vertex): Vertex => v.edges.filter(Graph.isClean)[0].child;

    closestCleanVertexes = (v: Vertex, n: number): Vertex[] => {
        if (n > v.edges.length) { n = v.edges.length; }
        else if (n < 0) { n = 0; }
        return v.edges.filter(Graph.isClean).slice(0, n).map((edge) => edge.child);
    }

    static mean = (vertexes: Vertex[]): Vector => {
        // Reduces the vector list to the sum of the vertex positions, then
        // returns that value's division by the vector list's length, thus
        // returning the mean.
        return Vector.times(1 / vertexes.length,
            vertexes.reduce(((accumVector, v) =>
                Vector.plus(accumVector, v.circle.pos)), new Vector(0, 0)));
    }

    behaviorRun = (game: Game): void => this.vertexes.forEach((v) => v.circle.behave(v, game));

    // The thought process behind adding delta is that I'm going to reprocess
    // information in the vertexes loops anyways, so I'm missing a speed bonus
    // here slightly. Regardless, I want an immutable state, thus I am adding
    // deltas which will be processed at a different part of the game running
    // loop. That is, something like REPL (read eval print loop). I want there
    // to exist one consistent state which persists between the read, evaluate,
    // and print parts.
    clippingPush = (edge: Edge): void => {
        let dirTo = Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
        // edge.distance should be negative if clipping
        let multiplier = (1 - edge.dist) / 25
        this.addDelta(
            this.indexOf(edge.parent),
            Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
    }

    // I guess there's not a better way to do this. I would think that there
    // would be. But its O(n), or Omega(1), but whatever.
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
