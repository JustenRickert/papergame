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

/* IDEA
     Okay. I was reading this thing
     http://es6-features.org/#ClassInheritanceFromExpressions, and it gave me a
     super good idea about how to handle different kinds of red units.

   First, there needs to be a set of classes for behaviors. I will make an
   interface which consists of an array of predicate functions (conditions), and
   corresponding (function) consequences which ultimately will be how the circles
   appear on the screen and act accordingly.

   Each circle has a default behavior, which is just to wander closely to the
   moment of nearly, friendly circles. Aside from that, the behaviors of the
   circles are put into a list member attribute of each of the circles. Each of
   the behavior predicates get run, then acting with the associated behavior
   consequence if any of the corresponding predicates return true. */

export interface Behavior {
  condition(v: Vertex, game: Game): boolean;
  consequence(v: Vertex, game: Game): any;
  reinitialize(pos: Vector): void;
}

/* Attack the closest target to the circle given that the attackRate allows it.
 * The consequence is a sort of lunging attack that throws the attacking circle
 * (attackC: Circle) at the defending circle (defendC/targetC: Circle). */
export class AttackBehavior implements Behavior {
  bAttack: BasicAttack;
  attackRange: number = 50;
  lungeVelocity: number = 3;
  targetEdge: Edge;

  constructor() {
    this.bAttack = new BasicAttack(2);
  }

  reinitialize = (): void => {
    this.bAttack = new BasicAttack(2);
  }

  condition = (v: Vertex, game: Game): boolean => {
    return this.bAttack.canAttack(game);
  }

  consequence = (attackV: Vertex, game: Game): any => {
    this.targetEdge = attackV.edges.filter(Graph.isDirty).filter(Graph.isEdgeChildAlive)[0];
    if (this.targetEdge === undefined) {
      return
    }
    if (Math.abs(attackV.circle.angleToCircle(this.targetEdge.child.circle)) < .1 &&
      this.targetEdge.dist < this.attackRange) {
      this.lungeAndAttack(attackV.circle, game);
    } else {
      attackV.circle.moveToPosition(this.targetEdge.child.circle.pos, game.graph);
    }
  }

  public lungeAndAttack = (attackC: Circle, game: Game): void => {
    attackC.moveForwardByScalarVel(this.lungeVelocity, game.graph);
    if (Circle.isClipping(attackC, this.targetEdge.child.circle)) {
      this.bAttack.attack(this.targetEdge.child.circle, game);
    }
  }
}

/* I want this behavior to be the default behavior for circles. Tells the circle
 * to wander if the circle is within the wander Radius (wanderRadius) of the
 * moment (the "vector mean" if the mean is the average of a set of values) of
 * the closest five, friendly circles. */
export class WanderCloselyBehavior implements Behavior {
  static shouldWanderCount = 0;
  private shouldRunToGroup: boolean;
  private shouldWander: number = 30;
  private positionToMove: Vector;
  private wanderPosition: Vector;
  private wanderRadius: number = 7;

  constructor(pos: Vector) {
    this.positionToMove = pos;
    this.wanderPosition = pos;
  }

  reinitialize = (pos: Vector): void => {
    this.positionToMove = pos;
    this.wanderPosition = pos;
  }

  private outOfBoundCheck(v: Vertex, game: Game) {
    if (this.positionToMove.x < 4 * v.circle.radius ||
      this.positionToMove.x > game.canvas.width - 4 * v.circle.radius ||
      this.positionToMove.y < 4 * v.circle.radius ||
      this.positionToMove.y > game.canvas.height - 4 * v.circle.radius) {
      return true;
    }
    else
      return false;
  }
  // Timed constraint. If constrained, then just stay put, maybe make him
  // randomly turn distances.
  public condition(v: Vertex, game: Game): boolean {
    this.positionToMove = Graph.mean(game.graph.closestCleanVertexes(v, 3))
    if (Vector.distance(this.positionToMove, v.circle.pos) >
      this.wanderRadius * v.circle.radius) {
      this.shouldRunToGroup = true;
    } else {
      this.shouldRunToGroup = false;
      if (this.shouldWander < 0) {
        this.willWander(v.circle, game.frame);
      }
    }
    return true;
  }
  // The circle is either far enough away to want to run towards the group, or
  // the circle wanders around aimlessly.
  consequence = (v: Vertex, game: Game): any => {
    if (this.outOfBoundCheck(v, game))
      v.circle.moveToPosition(new Vector(320, 320), game.graph)
    if (this.shouldRunToGroup)
      this.runToGroup(v, game.graph);
    else if (this.shouldWander >= 0) {
      this.wander(v, game.graph);
      this.shouldWander--;
    }
  }
  private runToGroup(v: Vertex, graph: Graph): void {
    v.circle.moveToPosition(this.positionToMove, graph);
  }
  private wander(v: Vertex, graph: Graph): void {
    v.circle.moveToPosition(this.wanderPosition, graph);
  }
  private willWander(c: Circle, frame: number): void {
    if (frame % 300 === 0 && Math.random() < 0.30) {
      this.shouldWander = WanderCloselyBehavior.shouldWanderCount;
      this.wanderPosition =
        Vector.plus(this.positionToMove,
          Vector.times(
            3 * this.wanderRadius * Math.random() * c.radius,
            Vector.random()));
    }
  }
}

/* TODO: Move around the nearest, friendly circle clockwise, switching
 * directions periodically. There could maybe be a damage consequence upon
 * clipping an enemy circle. */
export class circleBehavior implements Behavior {
  constructor(v: Vertex, game: Game) { }
  // Do the circling behavior always
  condition(v: Vertex, game: Game): boolean {
    return true
  }
  reinitialize = (): void => { }
  // Move around the nearest circle clockwise, switching directions
  // periodically.
  consequence(): any {
    return
  }
}

export class SimpleAimShootBehavior implements Behavior {
  public bShoot: BasicShoot;
  public attackRange: number = 440;
  public targetV: Vertex;

  constructor() {
    this.bShoot = new BasicShoot(3);
  }

  reinitialize = (): void => { this.bShoot = new BasicShoot(3) };

  condition = (v: Vertex, game: Game): boolean => {
    let edge = v.edges.filter(Graph.isDirty).filter(Graph.isEdgeChildAlive)[0];
    if (edge === undefined) {
      return false
    }
    if (this.bShoot.canAttack(game) && edge.dist < this.attackRange) {
      this.targetV = edge.child;
      return true;
    }
    return false;
  }

  consequence = (v: Vertex, game: Game): any => {
    if (Math.abs(v.circle.angleToCircle(this.targetV.circle)) < .1) {
      this.shootBullet(v, game);
      this.bShoot.resetAttack(game);
    } else
      v.circle.turnToPosition(this.targetV.circle.pos);
  }

  shootBullet = (v: Vertex, game: Game): void => {
    let dirTo = v.circle.vel;
    Bullet.shoot(
      v.circle.pos,
      Vector.times(1 / Vector.mag(dirTo), dirTo),
      v.circle.teamColor,
      this.bShoot.damage,
      game.graph);
  }
}

export class chargeOpponentBehavior implements Behavior {
  constructor() { }
  // Do the circling behavior always
  condition(v: Vertex, game: Game): boolean {
    return true
  }

  reinitialize = (): void => { }
  // Move around the nearest circle clockwise, switching directions
  // periodically.
  consequence(v: Vertex, game: Game): any {
    return
  }
}

