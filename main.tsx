// -*- mode:typescript -*-
// NEW PROJECT WOOH

/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that the end goal
 * is one team winning over the other. */

function start() {
    clearScreen();
    game.collision();
    game.run();
    game.draw();
    requestAnimationFrame(start);
}


var canvas: any = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var LASTCLICK = new Vector(0, 0);
canvas.onclick = function updateLastClick(event) {
    console.log(event)
    var mPos = getMousePos(canvas, event)
    LASTCLICK = new Vector(mPos.x, mPos.y);
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var game = new Game(7);
game.spawnReds();
start();





// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}

// Blue is the good guys, but maybe add user changeable colors or something.
class BlueCircle extends Circle {
    constructor() {
        super(35, new Vector(500, 800))
        this.color = "Blue";
    }
    public follow(cir: Vector): void {
        this.moveToPosition(cir);
    }
}
