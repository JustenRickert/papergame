//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

// import { CANVAS, CTX } from './globaldeclarations'
import { Circle } from './circle'
import { Vector } from './vector'
import { BasicShoot } from './life'
import { Bullet } from './bullet'
import { Game } from './game'
import { Vertex, Edge, Graph } from './graph'
import { BasicAttack } from './life'
import { Behavior } from './behavior'


export class EnCircleBehavior implements Behavior {
  omega: number;
  radius: number;
  alpha: number;
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
    v.circle.moveForwardByVec(new Vector(Math.cos(this.omega) * v.circle.speed,
                                         Math.sin(this.omega) * v.circle.speed));
  }

  increment = (v: Vertex): void => {
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
    this.targetEdge = attackV.edges.filter(Graph.isDirty).filter(Graph.isEdgeChildAlive)[0];
    return true
  }
  consequence = (attackV: Vertex, game: Game): any => {
    attackV.circle.moveToPosition(this.targetEdge.child.circle.pos, game.graph)
  }
}
