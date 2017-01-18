class Bullet {
    pos: Vector;
    vel: Vector;
    size: number = 2;

    constructor(position: Vector, direction: Vector) {
        this.pos = position;
        this.vel = direction;
    }

    // Takes a position, and a direction, places a bullet on the graph at the
    // position, moving in some vector direction. The bullet is added to the
    // bullet array in graph, wherein graph handles its collision.
    static shoot = (position: Vector, direction: Vector, graph: Graph): void => {
        graph.bullets.push(new Bullet(position, direction));
    }

    behave = (game: Game): void => {
        // if (/* Clipping with closest vertex */) {
        // } else
        //     this.moveForward(game);
    }

    isThenClipping = (graph: Graph, cb: CollisionBucket): boolean => {
        let vertexes = cb.vertexesAtIndex(cb.gridIndexOf(this.pos));
        for (let v of vertexes) {
            if (this.isClippingVertex(v)) {
                this.clip(v);
                break;
            }
            return false
        }
        return true
    }

    clip = (v: Vertex) => {
        // Damage vertex circle
        // Make the bullet disappear
    }

    isClippingVertex = (vertex: Vertex): boolean =>
        Vector.distance(vertex.circle.pos, this.pos) > vertex.circle.radius + this.size;

    moveForward = (game): void => {
        this.pos = Vector.plus(this.pos, this.vel);
    }

    drawBullet = (sideLength: number): void =>
        Shape.drawRect(this.pos, this.vel);

}
