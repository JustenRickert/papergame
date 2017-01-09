// -*- mode:typescript -*-

/* These are to be the place to have all of the red circles and things */

/* RedCircle is going to be the base class for all friendly circles. The default
 * behavior of red circles will be to wander closely to the nearest five
 * friendly units. Otherwise, this circle is just fucking bag of meat awaiting
 * death. */
class RedCircle extends Circle {

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Red";
        this.timeAlive = 0

        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
    public increment() {
        this.timeAlive++
    }
}

// class Reds {
//     // I'm sure there's really no need to have the count variable... but it's
//     // just one little number so idc.
//     public count: number;
//     public all: RedCircle[];

//     constructor(count: number, gameCount: number) {
//         this.count = count;
//         this.all = [];
//         for (var i = 0; i < count; i++) {
//             this.all.push(new RedCircle(i, new AttackBehavior()));
//         }
//         gameCount += count
//     }

//     public increment = (): void => {
//         for (let rc of this.all)
//             rc.timeAlive++
//     }
//     public positionAll = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].position(15, 15);
//         }
//     }
//     public draw = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].draw();
//         }
//     }
//     public moveToPosition = (v: Vector): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].moveToPosition(v);
//         }
//     }
//     public isThenClipping = (): void => {
//         for (let r of this.all) { // r for red
//             for (let or of this.all) { // or for other red
//                 if (r !== or) {
//                     Circle.isThenClipping(or, r);
//                 }
//             }
//         }
//     }
//     public distanceTable = (): number[][] => {
//         var table: any[] = [];
//         for (let i = 0; i < this.count; i++) {
//             table[i] = []
//             for (let j = 0; j < this.count; j++) {
//                 table.push(Infinity);
//             }
//         }
//         for (let i = 0; i < this.count; i++) {
//             for (let j = 0; j < this.count; j++) {
//                 if (i !== j) {
//                     table[i][j] = Vector.dist(this.all[i].pos, this.all[j].pos);
//                 }
//             }
//         }
//         return table;
//     }
// }
