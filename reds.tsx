/* These are to be the place to have all of the red circles and things */

// var p: Promise<any> = (resolve, reject) => int {
//     resolve('a string')
// };


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
    condition(...args: any[]): boolean;
    consequence(...args: any[]): any;
}

class WanderCloselyBehavior implements Behavior {
    private shouldRunToGroup: boolean;
    private shouldWander: number;
    private positionToMove: Vector;
    private wanderPosition: Vector;
    private wanderRadius: number = 7;

    constructor() { }
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    public condition(rc: RedCircle, g: Game): boolean {
        this.positionToMove = game.momentClosestFive(rc);
        if (Vector.dist(this.positionToMove, rc.pos) > this.wanderRadius * rc.radius) {
            this.shouldRunToGroup = true;
        } else {
            this.shouldRunToGroup = false;
            if (!this.shouldWander) {
                this.willWander(rc);
            }
        }
        return true;
    }
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    public consequence(rc: RedCircle): any {
        if (this.shouldRunToGroup)
            this.runToGroup(rc);
        else if (this.shouldWander > 0)
            this.wander(rc);
    }
    private runToGroup(rc: RedCircle): void {
        rc.moveToPosition(this.positionToMove)
    }
    private wander(rc: RedCircle): void {
        rc.moveToPosition(this.wanderPosition);
        this.shouldWander--;
    }
    private willWander(rc): void {
        if (Math.random() < 0.1) {
            this.shouldWander = 60;
            this.wanderPosition =
                Vector.plus(this.positionToMove, Vector.times(
                    this.wanderRadius * Math.random() * rc.radius,
                    Vector.random()));
        }
    }
}

/* Move around the nearest circle clockwise, switching directions
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

// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
class RedCircle extends Circle {
    public timeAlive: number;
    public wander: Behavior = new WanderCloselyBehavior();

    public id: number;
    constructor(id: number, ...behavior: Behavior[]) {
        super(20, new Vector(200, 300))
        this.id = id;
        this.color = "Red";
        this.state = new State();
        this.timeAlive = 0
    }
    public increment() {
        this.timeAlive++
    }
    public behave(g: Game) {
        this.wander.condition(this, g);
        this.wander.consequence(this);
    }
}

class Reds {
    public count: number;
    public allRed: RedCircle[];

    constructor(count: number) {
        this.count = count;
        this.allRed = []
        for (var i = 0; i < this.count; i++) {
            this.allRed.push(new RedCircle(i));
        }
    }
    public increment() {
        for (let rc of this.allRed)
            rc.timeAlive++
    }
    public positionAll(): void {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].move(330 + 20 * i, 250 + 20 * i);
            // this.all[i].move(322 + 20 * i, 322 + 20 * i)
        }
    }
    public draw(): void {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].draw();
        }
    }
    public moveToPosition(): void {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].moveToPosition(LASTCLICK);
        }
    }
    public isThenClipping(): void {
        for (let r of this.allRed) { // r for red
            for (let or of this.allRed) { // or for other red
                if (r !== or) {
                    Circle.isThenClipping(or, r);
                }
            }
        }
    }
    public distanceTable(): number[][] {
        var table: any[] = [];
        for (let i = 0; i < this.count; i++) {
            table[i] = []
            for (let j = 0; i < this.count; i++) {
                table.push(Infinity);
            }
        }
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                if (i !== j) {
                    table[i][j] = Vector.dist(this.allRed[i].pos, this.allRed[j].pos);
                }
            }
        }
        return table;
    }
}
