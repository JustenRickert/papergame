//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { Vector, Shape } from './vector'
import { CollisionBucket } from './collisionbucket'
import { Vertex, Graph } from './graph'
import { Game } from './game'

export class Bullet {
  pos: Vector;
  vel: Vector;
  color: string;
  damage: number = 2;

  size: number = 2;

  constructor(position: Vector, direction: Vector, color: string, damage: number) {
    this.pos = position;
    this.vel = direction;
    this.color = color;
  }

  isDirty = (v: Vertex): boolean => this.color !== v.circle.teamColor;

  behave = (game: Game): void => {
    if (this.isThenClipping(game.graph, game.graph.collisionBucket)) return
    else this.moveForward(game);
  }

  isThenClipping = (graph: Graph, cb: CollisionBucket): boolean => {
    let vertexes = cb.vertexesAtIndex(cb.gridIndexOf(this.pos)).filter(this.isDirty);
    for (let v of vertexes) {
      if (this.isClippingVertex(v) && v.circle.isAlive()) {
        this.clip(v, graph);
        return true;
      }
    }
    return false;
  }

  // extending out of bounds for bullets to 200% ** 2 the size.
  isOutOfBounds = (graph: Graph): boolean =>
    this.pos.x < -graph.size.width / 2
    || this.pos.x > 3 * graph.size.width / 2
    || this.pos.y < -graph.size / 2
    || this.pos.y > 3 * graph.size.height / 2;

  isThenOutOfBounds = (graph: Graph): void => {
    if (this.isOutOfBounds(graph)) graph.removeBullet(this);
  }

  clip = (v: Vertex, graph: Graph) => {
    v.circle.life.damage(this.damage)
    graph.removeBullet(this);
  }

  isClippingVertex = (vertex: Vertex): boolean => {
    return Vector.distance(vertex.circle.pos, this.pos) < vertex.circle.radius;
  }

  moveForward = (game: Game): void => {
    this.pos = Vector.plus(this.pos, this.vel);
  }

  draw = (): void => Shape.drawThinTriangle(this.pos, this.vel);

  // Takes a position, and a direction, places a bullet on the graph at the
  // position, moving in some vector direction. The bullet is added to the
  // bullet array in graph, wherein graph handles its collision.
  static shoot = (
    position: Vector, direction: Vector, color: string, damage: number,
    graph: Graph): void => {
    graph.bullets.push(new Bullet(position, direction, color, damage));
  }
}
