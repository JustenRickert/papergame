// -*- mode:typescript -*-

/* These are to be the place to have all of the red circles and things */

/* RedCircle is going to be the base class for all friendly circles. The default
 * behavior of red circles will be to wander closely to the nearest five
 * friendly units. Otherwise, this circle is just fucking bag of meat awaiting
 * death. */
class RedCircle extends Circle {
    public timeAlive: number;
    public behaviors: Behavior[];
    public wander: Behavior = new WanderCloselyBehavior(); // Default behavior

    public life = new Life(5);

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Red";
        this.timeAlive = 0
    }
    public increment() {
        this.timeAlive++
    }
    public behave(c: Circle, g: Game): void {
        for (let bhvr of this.behaviors) {
            if (bhvr.condition(c, g)) {
                bhvr.consequence(c);
                return
            }
        }
        if (this.wander.condition(c, g)) {
            this.wander.consequence(c);
            return
        }
    }
}

class Reds {
    // I'm sure there's really no need to have the count variable... but it's
    // just one little number so idc.
    public count: number;
    public all: RedCircle[];

    constructor(count: number, gameCount: number) {
        this.count = count;
        this.all = [];
        for (var i = 0; i < count; i++) {
            this.all.push(new RedCircle(i));
        }
        gameCount += count
    }

    public increment = (): void => {
        for (let rc of this.all)
            rc.timeAlive++
    }
    public positionAll = (): void => {
        for (var i = 0; i < this.count; i++) {
            this.all[i].position(330 + 20 * i, 250 + 20 * i);
        }
    }
    public draw = (): void => {
        for (var i = 0; i < this.count; i++) {
            this.all[i].draw();
        }
    }
    public moveToPosition = (v: Vector): void => {
        for (var i = 0; i < this.count; i++) {
            this.all[i].moveToPosition(v);
        }
    }
    public isThenClipping = (): void => {
        for (let r of this.all) { // r for red
            for (let or of this.all) { // or for other red
                if (r !== or) {
                    Circle.isThenClipping(or, r);
                }
            }
        }
    }
    public distanceTable = (): number[][] => {
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
                    table[i][j] = Vector.dist(this.all[i].pos, this.all[j].pos);
                }
            }
        }
        return table;
    }
}
