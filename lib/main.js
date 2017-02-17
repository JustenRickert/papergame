//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:
"use strict";
var globaldeclarations_1 = require("./globaldeclarations");
var vector_1 = require("./vector");
var blue_1 = require("./blue");
var red_1 = require("./red");
var game_1 = require("./game");
var player_1 = require("./player");
var behavior_1 = require("./behavior");
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
    globaldeclarations_1.ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
var STARTING_UNITS_PLAYER = (function () {
    var circles = [];
    for (var _i = 0, _a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; _i < _a.length; _i++) {
        var i = _a[_i];
        circles.push(new red_1.RedCircle(i));
    }
    circles.forEach(function (c) { return c.pos = new vector_1.Vector(0, 0); });
    return cardify(circles);
})();
var STARTING_UNITS_ENEMY = (function () {
    var circles = [];
    for (var _i = 0, _a = [0, 1, 2, 3, 4, 5, 6]; _i < _a.length; _i++) {
        var i = _a[_i];
        circles.push(new blue_1.BlueCircle(i + 12));
    }
    circles.forEach(function (c) { return c.pos = new vector_1.Vector(globaldeclarations_1.canvas.width, globaldeclarations_1.canvas.height); });
    return cardify(circles);
})();
function cardifyOne(circle) {
    var uc = new player_1.UnitCard(circle);
    uc.behavior = [new behavior_1.SimpleAimShootBehavior(), new behavior_1.AttackBehavior()];
    return uc;
}
exports.cardifyOne = cardifyOne;
function cardify(circle) {
    var l = [];
    circle.forEach(function (c) { return l.push(new player_1.UnitCard(c)); });
    l.forEach(function (card) { return card.behavior = [new behavior_1.SimpleAimShootBehavior(), new behavior_1.AttackBehavior()]; });
    l.forEach(function (card) { return l[l.indexOf(card)].circle.behaviors =
        [new behavior_1.SimpleAimShootBehavior(), new behavior_1.AttackBehavior()]; });
    return l;
}
exports.cardify = cardify;
var player = new player_1.Player(STARTING_UNITS_PLAYER);
var playerAdds = [];
var enemy = new player_1.Player(STARTING_UNITS_ENEMY);
var enemyAdds = [];
var game = new game_1.Game(player, enemy);
testGameLoop();
function testGameLoop() {
    if (game.winCondition()) {
        console.log('game was won');
        game.reinitialize('win');
    }
    else if (game.loseCondition()) {
        console.log('game was lost');
        game.reinitialize('loss');
    }
    if (game.running) {
        game.graph.behaviorRun(game);
        game.graph.bulletRun(game);
        game.graph.isThenBulletClipping();
        game.graph.isThenClipping();
        game.graph.outOfBoundsBulletsRun();
        clearScreen();
        game.graph.drawVertexes();
        game.graph.drawBullets();
        game.graph.sumResetDelta();
        game.graph.updateCollisionBucket();
        game.graph.checkDead();
        game.increment();
    }
    else {
    }
    requestAnimationFrame(testGameLoop);
}
