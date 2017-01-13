// -*-mode:typescript-*-

/* With this class I'm using the sort of outline they have for disjoint set data
 * structures and operations. */

// I'm not sure if Information is a good name or not. Anyways, my first addition
// to this was this matrix called distance.

// DISTANCE

//   Holds the distances between all of the circles its considering. There are
//   going to be three different considerations, namely red to red
//   considerations, blue to blue considerations, and red to blue
//   considerations. Having the distances is rather useful, as the distance
//   between two circles is used in a lot of interactions. Having the table
//   results in a memory to computational complexity trade-off. Having the table
//   also allows for higher order functions like for example the
//   bottomFiveDistance function, which extracts the bottom five distances as a
//   list, treating each row as an array of distances.

// ANOTHER POTENTIAL DISTANCE MEASUREMENT

//   A minimum spanning tree could be used instead of the previous
//   distance-based thinking above. Clusters of close circles can be found
//   easily by simply erasing the maximum-weight edges of the minimum spanning
//   tree, then collecting the associated trees of the new forest. The above
//   distance table is an O(n^2) function, and results in new functions on the
//   arrays to be O(n). A minimum spanning tree algorithm could be O(n^2 +
//   lg(n)) which is only slightly worse, however, the forest (collections of
//   trees) could support a lot more interesting underlying functions, and the
//   O(n) functions from the distance ideas could be slightly improved to be a
//   function of O(n/a) for some a >= 1.

class Game {
    public won: boolean = false;
    public lost: boolean = false;

    public frame: number;
    public gameCount: number;

    public graph: Graph;
    public circles: Circle[];   // this might not be necessary... uses more ram

    // Superfluous at this point...
    // public red: Reds;
    // public blue: Blues;
    public distanceRed: number[][];
    public distanceBlue: number[][];

    constructor(player:Player) {
        this.circles = player.allCircles();
        this.graph = new Graph(player);
        this.graph
        this.frame = 0
    }
    public increment = (): void => { this.frame++ }
    public run = (): void => {
        this.increment()
    }
    public draw = (): void => {
        // this.red.draw();
        // this.blue.draw();
    }
    public spawnRed = (): void => {
        // spawns red dudes and then tells them what to do.
        // this.red.positionAll();
    }
    // public spawnBlue = (): void => {
        // spawns red dudes and then tells them what to do.
        // this.blue.positionAll();
    // }
    public markDead = (): void => {
        // for (let r of this.red.all) {
        //     if (r.isDead())
        //         r.markDead();
        // }
        // for (let b of this.blue.all) {
        //     if (b.isDead())
        //         b.markDead();
        // }
    }
    public losing = (): void => { this.lost = true }
    public winning = (): void => { this.won = true }
    // public checkWinLose = (): void => {
    //     if (this.red.all.every(Circle.isDead))
    //         this.losing();
    //     else if (this.blue.all.every(Circle.isDead))
    //         this.winning();
    // }
    // public collision = (): void => {
    //     // this.red.isThenClipping();
    //     // this.blue.isThenClipping();
    //     // this.redBlueIsThenClipping();
    // }
    public updateDistanceTable(): void {
        // this.distanceRed = this.red.distanceTable();
        // this.distanceBlue = this.blue.distanceTable();
    }
    // public closestCircle = (c: Circle, color?: string): Circle => {
        // if (color) {
        //     var group: Circle[] = {
        //         'Red': this.red.all,
        //         'Blue': this.blue.all
        //     }[color]
        // }
        // var minC: Circle;
        // var dist: number;
        // for (let otherC of group) {
        //     if (c !== otherC) {
        //         if (!minC && otherC.alive)
        //             minC = otherC
        //         dist = Vector.dist(c.pos, otherC.pos);
        //     } else dist = Infinity
        //     if (otherC.alive && dist && Vector.dist(c.pos, minC.pos) > dist)
        //         minC = otherC;
        // }
        // return minC;
    // }
    // public bottomFiveDistance = (c: Circle, color: string): any[] => {
    //     var distance = {
    //         'Red': this.distanceRed[c.id],
    //         // 'Blue': this.distanceBlue[c.id]
    //     }[color];
    //     let id = [];
    //     if (distance.length <= 5) {
    //         for (let j in distance) {
    //             id.push(j);
    //         }
    //         return zip(id, distance);
    //     }
    //     let dist = [];
    //     for (let j = 0; j < 5; j++) {
    //         id.push(j)
    //         dist.push(distance[j]);
    //     }
    //     let smallest: number = dist.indexOf(min(dist));
    //     for (let j = 5; j < distance.length; j++) {
    //         if (distance[j] > dist[smallest]) {
    //             dist[smallest] = distance[j];
    //             id[smallest] = j;
    //             smallest = dist.indexOf(min(dist));
    //         }
    //     }
    //     return zip(id, dist);
    // }
    /* Returns the center of mass of closest five circles to the circle
     * argument. */
    // public momentClosestFive = (c: Circle, color: string): Vector => {
    //     let clstFivePos: Vector[] = [];
    //     let botmFive: any[] = this.bottomFiveDistance(c, color);
    //     for (let e of botmFive) {
    //         var all = {
    //             'Red': this.red.all,
    //             // 'Blue': this.blue.all
    //         }[color];
    //         clstFivePos.push(all[e[0]].pos);
    //     }
    //     return Game.moment(clstFivePos);
    // }
    // public behave = (): void => {
    //     for (let r of this.red.all) {
    //         if (r.alive)
    //             r.behave(r, this);
    //     }
    //     for (let b of this.blue.all) {
    //         if (b.alive)
    //             b.behave(b, this);
    //     }
    // }

    /* Returns the center of mass. All of the circles have the same mass, so
     * it's a little silly to call it by that name (it is rather, the center of
     * all the points), but it's convenient anyways now that you know what I'm
     * talking about, hopefully. */
    static moment = (pos: Vector[]): Vector => {
        let sum: Vector = new Vector(0, 0);
        for (let p of pos) {
            sum = Vector.plus(sum, p);
        }
        return Vector.times(1 / pos.length, sum)
    }
}

/* HELPER FUNCTIONS
 *
 *     These are functions I use for conveniency and cause it makes me look cool
 *     that I ask for help. */

var min = (arr: number[]) => arr.reduce((a, b, i, arr) => {
    if (a !== undefined && b !== undefined)
        return Math.min(a, b);
    else
        return a === undefined ? b : a
});

var combin2 = (arr: any[]) => {
    let combs = []
    for (var i = 0; i < arr.length; i++)
        for (var j = i + 1; j < arr.length; j++)
            if (i !== j) {
                combs.push(arr[i], arr[j]);
            }
    return combs
}

var zip = (a1, a2) => a1.map((x, i) => [x, a2[i]])

var combine = (a) => {
    var fn = (n, src, got, all) => {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = 0; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}
