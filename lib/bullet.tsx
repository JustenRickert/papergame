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
        // if (/* Colliding with closest vertex */) {
        // } else
        //     this.moveForward(game);
    }
    moveForward = (game): void => {
        this.pos = Vector.plus(this.pos, this.vel);
    }
}
