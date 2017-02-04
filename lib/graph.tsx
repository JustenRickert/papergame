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
    bullets: Bullet[] = [];
    vertexDeltas: Vector[] = [];
    edges: Edge[];
    deadEdges: Edge[];
    player: Player;
    enemy: Player;
    dead: Vertex[] = [];

    size: { height: number, width: number };
    collisionBucket: CollisionBucket;

    constructor(player: Player, enemy: Player) {
        let nilVector = new Vector(0, 0);
        this.deadEdges = [];
        this.player = player;
        this.enemy = enemy;
        this.edges = Graph.sortedEdges(Graph.getEdges(player.circles().concat(enemy.circles())));
        this.vertexes = this.getVertexes(player.circles().concat(enemy.circles()));
        for (let i in this.vertexes) {
            this.vertexDeltas[i] = nilVector;
        }
        this.size = { height: canvas.height, width: canvas.width };
        this.collisionBucket = new CollisionBucket(this);
    }

    reinitializeBehaviors = (): void => {
        for (let v of this.vertexes) {
            v.circle.reinitializeBehaviors();
        }
    }

    giveVertexToDead = (vertex: Vertex): void => {
        this.dead.push(vertex);
    }

    checkDead = (): void => {
        for (let v of this.vertexes) {
            if (v.circle.life.health === 0) {
                v.circle.teamColor = 'gray'; // colors the circle gray for effect
                v.circle.color = 'gray'; // colors the circle gray for effect
                v.circle.alive = false;
                this.giveVertexToDead(v);
            }
        }
    }

    doesNotEdgeHaveVertex = (vertex: Vertex, edge: Edge) =>
        !this.doesEdgeHaveVertex(edge, vertex);

    doesEdgeHaveVertex = (edge: Edge, vertex: Vertex): boolean => {
        return edge.child.circle.id === vertex.circle.id
            || edge.parent.circle.id === vertex.circle.id;
    }

    clearBullets = (): void => {
        for (let b of this.bullets) {
            this.removeBullet(b);
        }
    }

    removeBullet = (b: Bullet): void => {
        this.bullets.splice(this.bullets.indexOf(b), 1);
    }

    outOfBoundsBulletsRun = (): void => this.bullets.forEach((b) =>
        b.isThenOutOfBounds(this));

    // Sums the delta with current position, then resets the delta.
    sumResetDelta = (): void => {
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
                - this.edges[i].parent.circle.radius - this.edges[i].child.circle.radius;
        }
        this.edges = Graph.sortedEdges(this.edges);
        // this.deadEdges = Graph.sortedEdges(this.deadEdges);
        // place new edges inside of vertexes
        for (let i in this.vertexes) {
            this.vertexes[i].edges = this.edgesWithCircleAsParent(this.vertexes[i].circle);
        }
    }

    updateCollisionBucket = (): void => this.collisionBucket.recalculateBucket(this);

    static isParentOrChildOfEdge = (circle: Circle, edge: Edge): boolean => {
        return circle.id === edge.parent.circle.id || circle.id === edge.child.circle.id;
    }

    static isParentOfEdge = (circle: Circle, edge: Edge): boolean =>
        circle === edge.parent.circle;

    getVertexes = (circles: Circle[]): Vertex[] => {
        let vertexes: Vertex[] = []
        for (let i in circles) {
            vertexes.push({
                circle: circles[i], edges: this.edgesWithCircleAsParent(circles[i])
            })
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

    edgesWithCircle = (c: Circle): Edge[] =>
        this.edges.filter(Graph.isParentOrChildOfEdge.bind(this, c));

    edgesWithCircleAsParent = (c: Circle): Edge[] =>
        this.edges.filter(Graph.isParentOfEdge.bind(this, c));

    static sortedEdges = (edges: Edge[]): Edge[] => edges.sort(Graph.compareDist);

    static produceVertex = (c: Circle): Vertex => {
        return { circle: c, edges: [] };
    }

    static produceEdge = (v1: Vertex, v2: Vertex): Edge => {
        return {
            parent: v1,
            child: v2,
            dist: Vector.distance(v1.circle.pos, v2.circle.pos)
        };
    }

    smallestDirtyEdgeFrom = (vertex: Vertex): Edge => {
        for (let e of this.edges.filter(Graph.isDirty)) {
            if (e.parent === vertex) return e;
        }
    }

    static compareDist = (e1: Edge, e2: Edge): number => e1.dist - e2.dist;

    static isDirty = (e: Edge): boolean =>
        e.parent.circle.teamColor !== e.child.circle.teamColor;

    static isClean = (e: Edge): boolean =>
        e.parent.circle.teamColor === e.child.circle.teamColor;

    // collision
    isThenClipping = (): void => {
        // So, this.edges is ordered, meaning when we stop finding colliding
        // edges, there won't be anymore colliding edges.
        for (let e of this.edges) {
            if (e.dist <= 0) this.clippingPush(e);
            else return
        }
    }

    isThenBulletClipping = (): void =>
        this.bullets.forEach((b) => b.isThenClipping(this, this.collisionBucket));

    closestVertex = (v: Vertex): Vertex => v.edges[0].child;

    closestDirtyVertex = (v: Vertex): Vertex => v.edges.filter(Graph.isDirty)[0].child;

    closestDirtyVertexes = (v: Vertex, n: number): Vertex[] => {
        if (n > v.edges.length) { n = v.edges.length; }
        else if (n < 0) { n = 0; }
        return v.edges.filter(Graph.isDirty).slice(0, n).map((edge) => edge.child);
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

    behaviorRun = (game: Game): void =>
        this.vertexes.forEach((v) => v.circle.behave(v, game));

    bulletRun = (game: Game): void => this.bullets.forEach((b) => b.behave(game));

    clippingPush = (edge: Edge): void => {
        let dirTo = Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
        // edge.distance should be negative if clipping
        let multiplier = (1 - edge.dist) / 16;
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

    drawVertexes = (): void => {
        this.vertexes.concat(this.dead).forEach((v): void => this.drawCircle(v.circle));
    }

    drawBullets = (): void => this.bullets.forEach((b): void => b.draw());

    drawCircle = (circle: Circle): void => {
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

    drawTest = (sideLength: number, position: Vector, direction: Vector): void =>
        Shape.drawRect(position, direction);

    // drawBullet = (bullet: Bullet): void => {
    //     ctx.beginPath();
    //     // forward point
    //     ctx.moveTo(
    //         bullet.pos.x + (3 * bullet.size / 4) * bullet.vel.x,
    //         bullet.pos.y + (3 * bullet.size / 4) * bullet.vel.y);
    //     // point to the left (or right, I dunno and it doesn't matter)
    //     ctx.lineTo(
    //         bullet.pos.x + (2 * bullet.size / 4) * bullet.vel.x + Math.PI / 3,
    //         bullet.pos.y + (2 * bullet.size / 4) * bullet.vel.y + Math.PI / 3);
    //     ctx.lineTo(
    //         bullet.pos.x + (2 * bullet.size / 4) * bullet.vel.x - Math.PI / 3,
    //         bullet.pos.y + (2 * bullet.size / 4) * bullet.vel.y - Math.PI / 3);
    // }
}
