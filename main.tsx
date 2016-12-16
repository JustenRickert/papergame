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

var game = new Game(7);

game.spawnReds();
function start() {
    clearScreen();
    game.collision();
    game.run();
    game.draw();
    requestAnimationFrame(start);
} start();





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
