// -*- mode:typescript -*-


class BlueCircle extends Circle {
    public timeAlive: number;
    public behaviors: Behavior[];
    public wander: Behavior = new WanderCloselyBehavior(); // Default behavior

    constructor(id: number, ...behaviors: Behavior[]) {
        super(id, 20, new Vector(200, 300))
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Blue";
        this.timeAlive = 0

        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
    public increment = (): void => {
        this.timeAlive++
    }
}

// class Blues {
//     // I'm sure there's really no need to have the count variable... but it's
//     // just one little number so idc.
//     public count: number;
//     public all: BlueCircle[];

//     constructor(count: number, gameCount: number) {
//         this.count = count;
//         this.all = [];
//         for (var i = 0; i < count; i++) {
//             this.all.push(new BlueCircle(i, new AttackBehavior()));
//         }
//         gameCount += count
//     }

//     public increment = (): void => {
//         for (let rc of this.all)
//             rc.timeAlive++
//     }
//     public positionAll = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].position(canvas.width-15, canvas.height-15);
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
//         for (let b of this.all) {
//             for (let or of this.all) {
//                 if (b !== or) {
//                     Circle.isThenClipping(or, b);
//                 }
//             }
//         }
//     }
//     public distanceTable = (): number[][] => {
//         var table: number[][] = [];
//         for (let i = 0; i < this.count; i++) {
//             table[i] = []
//             for (let j = 0; j < this.count; j++) {
//                 table[i].push(Infinity);
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
