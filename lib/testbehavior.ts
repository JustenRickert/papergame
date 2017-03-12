//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

// import { CANVAS, CTX } from './globaldeclarations'
// import { BasicShoot } from './life'
// import { Bullet } from './bullet'
// import { BasicAttack } from './life'
import { Behavior } from './behavior'
import { Circle } from './circle'
import { Vector } from './vector'
import { Game } from './game'
import { Vertex, Edge, Graph } from './graph'


export class EnCircleBehavior implements Behavior {
  // Alpha is the rate of change of the angle/direction, and omega is the
  // current angle/direction. In this simple case, alpha is a constant value.
  // Furthermore, d(omega) = alpha---that is, alpha is the derivative of omega;
  // said in a different, tautological way, omega is the integral of alpha. NOTE
  // HOWEVER THAT THIS ISNT PRECISELY TRUE. There is a correspondence between
  // the limit of something called the Riemann sum and the integral. Since this
  // is a computer program, there cannot the exact integral, as the integral is
  // an abstract mathematical idea to reason about computation.

  // Think of it this way: The circles move at 60 frames per second. At each
  // frame, there is small value, alpha, added to the angle, omega. So, omega =
  // sum_0^59(alpha); that is omega is the sum of 60 alphas added to omega every
  // second of simulation (one alpha is added at time t=0, then one at t=1, one
  // at t=2, etc.) Since this is quite a lot of alphas being added to the sum in
  // a very short amount of time, it is APPROXIMATELY equal to the integral.
  omega: number;
  alpha: number;
  radius: number;
  positionToMove: Vector;

  constructor(c: Circle) {
    c.speed = 3;
    this.omega = 0;
    this.radius = 320;
    this.alpha = Math.PI * c.speed / this.radius;
  }

  reinitialize = (): void => {
    // this.bAttack = new BasicAttack(2);
  }

  condition = (v: Vertex, game: Game): boolean => {
    this.increment(v);
    return true;
  }

  consequence = (v: Vertex, game: Game): any => {
    v.circle.direction -= this.alpha;
    // This is the equation of a circle according to the angle determined by the
    // logic aforementioned.
    v.circle.moveForwardByVec(new Vector(Math.cos(this.omega) * v.circle.speed,
                                         Math.sin(this.omega) * v.circle.speed));
  }

  increment = (v: Vertex): void => {
    // this is the atomic part of the Riemann sum
    this.omega += this.alpha;
    this.omega = this.omega % (2 * Math.PI);
    v.circle.moveForwardByVec(new Vector(Math.cos(this.omega),
                                         Math.sin(this.omega)));
  }
}

export class SimpleFollow implements Behavior {
  targetEdge: Edge;
  constructor(c: Circle) {
    c.speed = 1.5;
  }
  reinitialize = (): void => {}
  condition = (attackV: Vertex, game: Game): boolean => {
    // First, we filter the dirty edges from the attacking vertexes edge list.
    // Then, we filter out the edges consisting of only the alive circles. (A
    // filter is pretty close to the English word filter, in a programming
    // language a filter is an example of a Mathematical Partition. A
    // mathematical partition relies upon the Mathematical Laws of Dichotomy,
    // which dictates that either something belongs or doesn't belong to a set
    // according to a boolean function. So, either the boolean function returns
    // TRUE and nothing happens, or the boolean function returns FALSE and the
    // element is Filtered out.) This filter (or these two filters) returns the
    // DIRTY edges (i.e. the child and parent have different team colors) with
    // ALIVE children. Once filtered, the first Edge is simply taken (that is
    // the `[0]` at the end). Since the list of edges is sorted according
    // distance from the attacking vertex, this first element is the CLOSEST,
    // DIRTY, ALIVE Edge (which is exactly what we want).

    // In terms of computational complexity, this is pretty good. The filter
    // needs only to run across each of the other vertexes on the graph ONCE,
    // which is the best we can do. The second filter then only has to go
    // through the Proper Subset returned from the first filter (i.e. the
    // smaller set of elements Partitioned from the first filter).
    this.targetEdge = attackV.edges.filter(Graph.isDirty).filter(Graph.isEdgeChildAlive)[0];
    return true
  }
  consequence = (attackV: Vertex, game: Game): any => {
    attackV.circle.moveToPosition(this.targetEdge.child.circle.pos, game.graph)
  }
}
