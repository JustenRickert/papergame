//-*-mode:typescript-*-

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

var STARTING_UNITS_PLAYER: UnitCard[] = (() => {
    let circles = [];
    for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) // RedCircle needs a number id, lol
        circles.push(new RedCircle(i));
    circles.forEach((c) => c.pos = new Vector(0, 0));
    return cardify(circles);
})();

var STARTING_UNITS_ENEMY: UnitCard[] = (() => {
    let circles = [];
    for (let i of [0, 1, 2, 3, 4, 5, 6])
        circles.push(new BlueCircle(i + 12));
    circles.forEach((c) => c.pos = new Vector(canvas.width, canvas.height));
    return cardify(circles);
})();

function cardifyOne(circle: Circle): UnitCard {
    let uc = new UnitCard(circle);
    uc.behavior = [new SimpleAimShootBehavior(), new AttackBehavior()]
    return uc;
}

function cardify(circle: Circle[]): UnitCard[] {
    let l: UnitCard[] = [];
    circle.forEach((c) => l.push(new UnitCard(c)));
    l.forEach((card) => card.behavior = [new SimpleAimShootBehavior(), new AttackBehavior()]);
    l.forEach((card) => l[l.indexOf(card)].circle.behaviors =
        [new SimpleAimShootBehavior(), new AttackBehavior()]);
    return l;
}

var player = new Player(STARTING_UNITS_PLAYER);
var playerAdds: UnitCard[] = [];
var enemy = new Player(STARTING_UNITS_ENEMY);
var enemyAdds: UnitCard[] = [];
var game = new Game(player, enemy);
testGameLoop();

function testGameLoop() {
    if (game.winCondition()) {
        console.log('game was won')
        game.reinitialize('win');
    } else if (game.loseCondition()) {
        console.log('game was lost')
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
    } else {
    }
    requestAnimationFrame(testGameLoop);
}
