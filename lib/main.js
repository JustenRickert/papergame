// -*- mode:typescript -*-
// NEW PROJECT WOOH
/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that then the end
 * goal is one team winning over the other. */
function start() {
    game.frame++;
    game.updateDistanceTable();
    // console.log(
    //     game.bottomFiveDistance(game.red.all[0]),
    //     game.momentClosestFive(game.red.all[0]))
    clearScreen(); // TODO: There is better way to do this, clearing the screen
    // is pretty intensive, apparently. Also, the circles and things don't need
    // to be drawn every frame. They can just moved around, but that should be
    // easy to do later.
    game.collision();
    game.run();
    game.draw();
    game.markDead();
    game.checkWinLose();
    if (game.won || game.lost)
        return;
    requestAnimationFrame(start);
}
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event);
    LASTCLICK = new Vector(mPos.x, mPos.y);
};
var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
var game = new Game(100, 100);
game.spawnRed();
game.spawnBlue();
start();
// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
