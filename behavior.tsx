// -*- mode:typescript -*-

/* IDEA
     Okay. I was reading this thing
     http://es6-features.org/#ClassInheritanceFromExpressions, and it gave me a
     super good idea about how to handle different kinds of red units.

   First, there needs to be a set of classes for behaviors. I will make an
   interface which consists of an array of predicate functions, and
   corresponding consequences which ultimately will be how the circle appears on
   the screen.

   Secondly, behaviors can tell other circles what to do! */

interface Behavior {
    condition(c: Circle, g: Game): boolean;
    consequence(c: Circle): any;
}

class AttackBehavior implements Behavior {
    public condition(c: Circle, g: Game) {
        return false
    }
    public consequence(c: Circle) {
    }
}

/* Ugh. So this took a lot more work than I thought that it would take. Maybe
 * there's an easier way to go about this. I think this will work a lot better
 * in conjunction with other behaviors. I want this behavior to be the default
 * behavior for circles. */
class WanderCloselyBehavior implements Behavior {
    private shouldRunToGroup: boolean;
    private shouldWander: number = 60;
    private positionToMove: Vector;
    private wanderPosition: Vector;
    private wanderRadius: number = 7;

    constructor() {
        this.positionToMove = Vector.times(640, Vector.random());
        this.wanderPosition = Vector.times(640, Vector.random());
    }

    private outOfBoundCheck(c: Circle) {
        if (this.positionToMove.x < 4 * c.radius ||
            this.positionToMove.x > canvas.width - 4 * c.radius ||
            this.positionToMove.y < 4 * c.radius ||
            this.positionToMove.y > canvas.height - 4 * c.radius) {
            return true;
        }
        else
            return false;
    }
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    public condition(c: Circle, g: Game): boolean {
        this.positionToMove = game.momentClosestFive(c, c.color);
        if (Vector.dist(this.positionToMove, c.pos) > this.wanderRadius * c.radius) {
            this.shouldRunToGroup = true;
        } else {
            this.shouldRunToGroup = false;
            if (this.shouldWander < 0) {
                this.willWander(c);
            }
        }
        return true;
    }
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    public consequence(c: Circle): any {
        if (this.outOfBoundCheck(c))
            c.moveToPosition(new Vector(320, 320))
        if (this.shouldRunToGroup)
            this.runToGroup(c);
        else if (this.shouldWander >= 0) {
            this.wander(c);
            this.shouldWander--;
        }
    }
    private runToGroup(c: Circle): void {
        c.moveToPosition(this.positionToMove);
    }
    private wander(c: Circle): void {
        c.moveToPosition(this.wanderPosition);
    }
    private willWander(c: Circle): void {
        if (Math.random() < 0.001) {
            this.shouldWander = 60;
            this.wanderPosition =
                Vector.plus(this.positionToMove, Vector.times(
                    3 * this.wanderRadius * Math.random() * c.radius,
                    Vector.random()));
        }
    }
}

/* TODO: Move around the nearest circle clockwise, switching directions
 * periodically. */
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
