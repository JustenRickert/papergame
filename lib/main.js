define(["require", "exports", "./globaldeclarations", "./vector", "./blue", "./red", "./game", "./player", "./behavior", "./testbehavior"], function (require, exports, globaldeclarations_1, vector_1, blue_1, red_1, game_1, player_1, behavior_1, testbehavior_1) {
    "use strict";
    function clearCtx(ctx) {
        ctx.clearRect(0, 0, 640, 640);
    }
    var STARTING_UNITS_PLAYER = (function () {
        var circles = [];
        for (var _i = 0, _a = [0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16,
            17, 18, 19, 20, 21,
            22, 23, 25, 26, 27]; _i < _a.length; _i++) {
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
        circles.forEach(function (c) { return c.pos = new vector_1.Vector(globaldeclarations_1.GAME_CANVAS.width, globaldeclarations_1.GAME_CANVAS.height); });
        return cardify(circles);
    })();
    var TEST_CIRCLE = (function () {
        var circles = [];
        for (var _i = 0, _a = [0]; _i < _a.length; _i++) {
            var i = _a[_i];
            circles.push(new red_1.RedCircle(i));
        }
        circles.forEach(function (c) { return c.pos = new vector_1.Vector(320, 160); });
        return testCardify(circles);
    })();
    var TEST_ENEMY_CIRCLE = (function () {
        var circles = [];
        for (var _i = 0, _a = [0]; _i < _a.length; _i++) {
            var i = _a[_i];
            circles.push(new blue_1.BlueCircle(i));
        }
        circles.forEach(function (c) { return c.pos = new vector_1.Vector(320, 320); });
        return testCardifyEnemy(circles);
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
    function testCardify(circle) {
        var l = [];
        circle.forEach(function (c) { return l.push(new player_1.UnitCard(c)); });
        l.forEach(function (card) { return card.behavior = [new testbehavior_1.EnCircleBehavior(card.circle)]; });
        l.forEach(function (card) { return l[l.indexOf(card)].circle.behaviors =
            [new testbehavior_1.EnCircleBehavior(card.circle)]; });
        return l;
    }
    exports.testCardify = testCardify;
    function testCardifyEnemy(circle) {
        var l = [];
        circle.forEach(function (c) { return l.push(new player_1.UnitCard(c)); });
        l.forEach(function (card) { return card.behavior = [new testbehavior_1.SimpleFollowBehavior(card.circle)]; });
        l.forEach(function (card) { return l[l.indexOf(card)].circle.behaviors =
            [new testbehavior_1.SimpleFollowBehavior(card.circle)]; });
        return l;
    }
    exports.testCardifyEnemy = testCardifyEnemy;
    var Main = (function () {
        function Main() {
        }
        Main.testLoops = function (games, ctxs) {
            for (var i in games) {
                Main.testGameLoop(games[i], ctxs[i]);
            }
        };
        Main.testGameLoop = function (game, ctx) {
            if (game_1.Game.winCondition(game)) {
                console.log('game was won');
                game.reinitialize('win');
            }
            else if (game_1.Game.loseCondition(game)) {
                console.log('game was lost');
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
        };
        return Main;
    }());
    var testPlayer = new player_1.Player(TEST_CIRCLE);
    var testEnemy = new player_1.Player(TEST_ENEMY_CIRCLE);
    var game = new game_1.Game(testPlayer, testEnemy, globaldeclarations_1.GAME_CANVAS, globaldeclarations_1.GAME_CTX);
    var player = new player_1.Player(STARTING_UNITS_PLAYER);
    var enemy = new player_1.Player(STARTING_UNITS_ENEMY);
    var game2 = new game_1.Game(player, enemy, globaldeclarations_1.GAME_CANVAS_2, globaldeclarations_1.GAME_CTX_2);
    Main.testLoops([game, game2], [globaldeclarations_1.GAME_CTX, globaldeclarations_1.GAME_CTX_2]);
});
//# sourceMappingURL=main.js.map