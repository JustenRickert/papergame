// -*- mode:typescript -*-

/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that then the end
 * goal is one team winning over the other. */

// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}


var TEST_CIRCLES: Circle[] = [];
for (let i = 0; i < 10; i++) {
    TEST_CIRCLES.push(new RedCircle(i));
    TEST_CIRCLES[i].position(12, 12);
}
var graph = new Graph(TEST_CIRCLES);
testGameLoop();

function testGameLoop() {
    graph.behaviorRun();
    graph.isThenClipping();
    clearScreen();
    graph.drawVertexes();
    graph.sumResetDelta();
    requestAnimationFrame(testGameLoop);
}
