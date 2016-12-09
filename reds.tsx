/* These are to be the place to have all of the red circles and things */

class Reds {
    public count: number;
    public all: RedCircle[];

    constructor(count: number) {
        this.count = count;
        for (var i = 0; i < this.count; i++) {
            this.all.push(new RedCircle());
        }
    }
    public positionAll(): void {
        for (var i = 0; i < this.count; i++) {
            this.all[i].move(322 + 20 * i, 322 + 20 * i)
        }
    }
}
