/* These are to be the place to have all of the red circles and things */

// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
class RedCircle extends Circle {
    public state: State;
    constructor() {
        super(20, new Vector(200, 300))
        this.color = "Red";
        this.state = new State();
    }
}

class Reds {
    public count: number;
    public all: RedCircle[];

    constructor(count: number) {
        this.count = count;
        this.all = []
        for (var i = 0; i < this.count; i++) {
            this.all.push(new RedCircle());
        }
    }
    public positionAll(): void {
        for (var i = 0; i < this.count; i++) {
            this.all[i].move(12 + 20 * i, 12 + 20 * i);
            // this.all[i].move(322 + 20 * i, 322 + 20 * i)
        }
    }
    public draw(): void {
        for (var i = 0; i < this.count; i++) {
            this.all[i].draw();
        }
    }
    public moveToPosition(): void {
        for (var i = 0; i < this.count; i++) {
            this.all[i].moveToPosition(LASTCLICK);
        }
    }
    public isThenClipping(): void {
        for (let r of this.all) { // r for red
            for (let or of this.all) { // or for other red
                if (r !== or) {
                    Circle.isThenClipping(or, r);
                }
            }
        }
    }
}
