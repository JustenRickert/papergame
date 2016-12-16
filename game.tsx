// The canvas is pretty special:
//   width="640"
//   height="640"

var canvas: any = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var LASTCLICK = new Vector(0, 0);
canvas.onclick = function updateLastClick(event) {
    LASTCLICK = new Vector(event.clientX, event.clientY);
};

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

// var red = new RedCircle();
// red.move(1, 1);
// var blu = new BlueCircle();
// red.setVel(new Vector(1, 0));
// blu.setVel(new Vector(0.5, 0));
// blu.setSpeed(0.5);
// var GAME_FRAME = 0;
// var reds = new Reds(999);
// reds.positionAll();

