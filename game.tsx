/* With this class I'm using the sort of outline they have for disjoint set data
 * structures and operations. */


class Game {
    public red: Reds;
    // TODO public blue: Blues;
    constructor(redCount: number) {
        this.red = new Reds(redCount)
    }
    public run(): void {
        this.red.moveToPosition();
    }
    public draw(): void {
        this.red.draw();
    }
    public spawnReds(): void {
        // spawns red dudes and then tells them what to do.
        this.red.positionAll();
    }
    public collision(): void {
        this.red.isThenClipping();
    }
}


