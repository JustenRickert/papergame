//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:

import { GAME_CANVAS, GAME_CTX, GAME_CANVAS_2, GAME_CTX_2 } from './globaldeclarations'
import { Bullet } from './bullet'
import { Vector } from './vector'
import { Circle } from './circle'
import { BlueCircle } from './blue'
import { RedCircle } from './red'
import { CollisionBucket } from './collisionbucket'
import { Game } from './game'
import { Player, UnitCard } from './player'
import { AttackBehavior, SimpleAimShootBehavior } from './behavior'
import { EnCircleBehavior, SimpleFollow } from './testbehavior'

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
function clearCtx(ctx) {
  ctx.clearRect(0, 0, 640, 640);
  // ctx.width, ctx.height);
}

const STARTING_UNITS_PLAYER: UnitCard[] = (() => {
  let circles = [];
  for (let i of [0, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16,
    17, 18, 19, 20, 21,
    22, 23, 25, 26, 27]) // RedCircle needs a number id, lol
    circles.push(new RedCircle(i));
  circles.forEach((c) => c.pos = new Vector(0, 0));
  return cardify(circles);
})();

const STARTING_UNITS_ENEMY: UnitCard[] = (() => {
  let circles = [];
  for (let i of [0, 1, 2, 3, 4, 5, 6])
    circles.push(new BlueCircle(i + 12));
  circles.forEach((c) => c.pos = new Vector(GAME_CANVAS.width, GAME_CANVAS.height));
  return cardify(circles);
})();

const TEST_CIRCLE: UnitCard[] = (() => {
  let circles = [];
  for (let i of [0]) // RedCircle needs a number id, lol
    circles.push(new RedCircle(i));
  circles.forEach((c) => c.pos = new Vector(320, 160));
  return testCardify(circles);
})();

const TEST_ENEMY_CIRCLE: UnitCard[] = (() => {
  let circles = [];
  for (let i of [0]) // RedCircle needs a number id, lol
    circles.push(new BlueCircle(i));
  circles.forEach((c) => c.pos = new Vector(320, 320));
  return testCardifyEnemy(circles);
})();

export function cardifyOne(circle: Circle): UnitCard {
  let uc = new UnitCard(circle);
  uc.behavior = [new SimpleAimShootBehavior(), new AttackBehavior()]
  return uc;
}

export function cardify(circle: Circle[]): UnitCard[] {
  let l: UnitCard[] = [];
  circle.forEach((c) => l.push(new UnitCard(c)));
  l.forEach((card) => card.behavior = [new SimpleAimShootBehavior(), new AttackBehavior()]);
  l.forEach((card) => l[l.indexOf(card)].circle.behaviors =
    [new SimpleAimShootBehavior(), new AttackBehavior()]);
  return l;
}

export function testCardify(circle: Circle[]): UnitCard[] {
  let l: UnitCard[] = [];
  circle.forEach((c) => l.push(new UnitCard(c)));
  l.forEach((card) => card.behavior = [new EnCircleBehavior(card.circle)]);
  l.forEach((card) => l[l.indexOf(card)].circle.behaviors =
    [new EnCircleBehavior(card.circle)]);
  return l;
}

export function testCardifyEnemy(circle: Circle[]): UnitCard[] {
  let l: UnitCard[] = [];
  circle.forEach((c) => l.push(new UnitCard(c)));
  l.forEach((card) => card.behavior = [new SimpleFollow(card.circle)]);
  l.forEach((card) => l[l.indexOf(card)].circle.behaviors =
    [new SimpleFollow(card.circle)]);
  return l;
}


class Main {
  static testLoops(games: Game[], ctxs: CanvasRenderingContext2D[]) {
    for (let i in games) {
      Main.testGameLoop(games[i], ctxs[i]);
    }
  }
  static testGameLoop(game: Game, ctx: CanvasRenderingContext2D) {
    if (Game.winCondition(game)) {
      console.log('game was won')
      game.reinitialize('win');
    } else if (Game.loseCondition(game)) {
      console.log('game was lost')
      game.reinitialize('loss');
    }
    if (game.running) {
      game.graph.behaviorRun(game);
      game.graph.bulletRun(game);
      game.graph.isThenBulletClipping();
      game.graph.isThenClipping();
      game.graph.outOfBoundsBulletsRun();

      clearCtx(ctx);
      game.graph.drawVertexes(ctx);
      game.graph.drawBullets(ctx);
      game.graph.sumResetDelta();
      game.graph.updateCollisionBucket();

      game.graph.checkDead();

      game.increment();
    }
    requestAnimationFrame(Main.testGameLoop.bind(this, game, ctx));
  }
}

var testPlayer: Player = new Player(TEST_CIRCLE);
var testEnemy: Player = new Player(TEST_ENEMY_CIRCLE);
var game = new Game(testPlayer, testEnemy, GAME_CANVAS, GAME_CTX);

var player: Player = new Player(STARTING_UNITS_PLAYER);
var enemy: Player = new Player(STARTING_UNITS_ENEMY);
var game2 = new Game(player, enemy, GAME_CANVAS_2, GAME_CTX_2);

Main.testLoops([game, game2], [GAME_CTX, GAME_CTX_2])
// Main.testGameLoop(game2, GAME_CTX_2);
