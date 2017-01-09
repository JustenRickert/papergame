// -*- mode:typescript -*-

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

interface Behavior {
    condition(v: Vertex, graph: Graph): boolean;
    consequence(v: Vertex, graph: Graph): any;
}

/* Attack the closest target to the circle given that the attackRate allows it.
 * The consequence is a sort of lunging attack that throws the attacking circle
 * (attackC: Circle) at the defending circle (defendC/targetC: Circle). */
class AttackBehavior implements Behavior {
    public bAttack: BasicAttack = new BasicAttack(1);
    public attackRange: number = 3;
    public lungeVelocity: number = 3;
    public targetV: Vertex;

    public condition = (v: Vertex, graph: Graph): boolean => {
        // if (this.bAttack.canAttack()) {
        //     let opposingColor: string = {
        //         'Red': 'Blue',
        //         'Blue': 'Red'
        //     }[v.circle.color]
        //     this.targetV = graph.closestDirtyVertex(v);
        //     if (!this.targetV)
        //         return false
        //     return true;
        // }
        return false;
    }
    public consequence = (attackV: Vertex, graph: Graph): any => {
        // // Is the attacking circle close to the defending circle?
        // if (Vector.dist(attackV.circle.pos, this.targetV.circle.pos) >
        //     this.attackRange * attackV.circle.radius)
        //     attackV.circle.moveToPosition(this.targetV.circle.pos, graph);
        // // Is the angle right to lunge at the enemy?
        // else if (Math.abs(attackV.circle.angleToCircle(this.targetV.circle)) < .1) {
        //     this.lungeAndAttack(attackV.circle);
        // }
        // // Turn to the defending circle so the previous predicate is true.
        // else
        //     attackV.circle.turnToPosition(this.targetV.circle.pos);
    }
    public lungeAndAttack = (attackC: Circle): void => {
        // attackC.moveForwardByScalarVel(this.lungeVelocity);
        // if (Circle.isClipping(attackC, this.targetV.circle)) {
        //     this.bAttack.attack(this.targetV.circle);
        // }
    }
}

/* I want this behavior to be the default behavior for circles. Tells the circle
 * to wander if the circle is within the wander Radius (wanderRadius) of the
 * moment (the "vector mean" if the mean is the average of a set of values) of
 * the closest five, friendly circles. */
class WanderCloselyBehavior implements Behavior {
    private shouldRunToGroup: boolean;
    static shouldWanderCount = 60
    private shouldWander: number = 60;
    private positionToMove: Vector;
    private wanderPosition: Vector;
    private wanderRadius: number = 7;

    constructor() {
        this.positionToMove = Vector.times(640, Vector.random());
        this.wanderPosition = Vector.times(640, Vector.random());
    }

    private outOfBoundCheck(v: Vertex) {
        if (this.positionToMove.x < 4 * v.circle.radius ||
            this.positionToMove.x > canvas.width - 4 * v.circle.radius ||
            this.positionToMove.y < 4 * v.circle.radius ||
            this.positionToMove.y > canvas.height - 4 * v.circle.radius) {
            return true;
        }
        else
            return false;
    }
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    public condition(v: Vertex, graph: Graph): boolean {
        // console.log(Graph.mean(graph.closestCleanVertexes(v, 3)));
        this.positionToMove = Graph.mean(graph.closestCleanVertexes(v, 3))
        // console.log(Vector.dist(this.positionToMove, v.circle.pos))
        if (Vector.dist(this.positionToMove, v.circle.pos) >
            this.wanderRadius * v.circle.radius) {
            this.shouldRunToGroup = true;
        } else {
            this.shouldRunToGroup = false;
            if (this.shouldWander < 0) {
                this.willWander(v.circle);
            }
        }
        return true;
    }
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    public consequence(v: Vertex, graph: Graph): any {
        if (this.outOfBoundCheck(v))
            v.circle.moveToPosition(new Vector(320, 320), graph)
        if (this.shouldRunToGroup)
            this.runToGroup(v, graph);
        else if (this.shouldWander >= 0) {
            this.wander(v, graph);
            this.shouldWander--;
        }
    }
    private runToGroup(v: Vertex, graph: Graph): void {
        v.circle.moveToPosition(this.positionToMove, graph);
    }
    private wander(v: Vertex, graph: Graph): void {
        v.circle.moveToPosition(this.wanderPosition, graph);
    }
    private willWander(c: Circle): void {
        if (Math.random() < 0.001) {
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
class circleBehavior implements Behavior {
    constructor() { }
    // Do the circling behavior always
    condition() {
        return true
    }
    // Move around the nearest circle clockwise, switching directions
    // periodically.
    consequence() {
        return
    }
}
