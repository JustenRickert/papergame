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
//   list, treating each row as a string of distances.

interface Information {
    red: Reds;
    distanceRed: number[][];
}

class Game implements Information {
    public frame: number;

    public red: Reds;
    public distanceRed: number[][];

    constructor(redCount: number) {
        this.red = new Reds(redCount)
    }
    public run(): void {
        this.red.increment();
        // this.red.moveToPosition();
        this.behave();
    }
    public draw(): void {
        this.red.draw();
    }
    public spawnRed(): void {
        // spawns red dudes and then tells them what to do.
        this.red.positionAll();
    }
    public collision(): void {
        this.red.isThenClipping();
    }
    public updateDistanceTable(): void {
        this.distanceRed = this.red.distanceTable();
    }
    public bottomFiveDistance(r: RedCircle): any[] {
        let id = [];
        if (this.distanceRed[r.id].length < 5) {
            for (let j in this.distanceRed[r.id]) {
                id.push(j);
            }
            return zip(id, this.distanceRed[r.id]);
        }
        let dist = [];
        for (let j = 0; j < 5; j++) {
            id.push(j)
            dist.push(this.distanceRed[r.id][j]);
        }
        let smallest: number = dist.indexOf(min(dist));
        for (let j = 5; j < this.distanceRed[r.id].length; j++) {
            if (this.distanceRed[r.id][j] > dist[smallest]) {
                dist[smallest] = this.distanceRed[r.id][j];
                id[smallest] = j;
                smallest = dist.indexOf(min(dist));
            }
        }
        return zip(id, dist);
    }
    /* Returns the center of mass. All of the circles have the same mass, so
     * it's a little silly to call it by that name (it is rather, the center of
     * all the points), but it's convenient anyways now that you know what I'm
     * talking about, hopefully. */
    static moment(pos: Vector[]): Vector {
        let sum: Vector = new Vector(0, 0);
        for (let p of pos) {
            sum = Vector.plus(sum, p);
        }
        return Vector.times(1 / pos.length, sum)
    }
    /* Returns the center of mass of closest five circles to the circle
     * argument. */
    public momentClosestFive(c: RedCircle): Vector {
        let clstFivePos: Vector[] = [];
        let botmFive: any[] = this.bottomFiveDistance(c);
        for (let e of botmFive) {
            clstFivePos.push(this.red.allRed[e[0]].pos);
        }
        return Game.moment(clstFivePos);
    }
    public behave(): void {
        for (let r of this.red.allRed) {
            r.behave(this);
        }
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

var combine = function(a) {
    var fn = function(n, src, got, all) {
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
