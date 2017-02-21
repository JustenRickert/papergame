define(["require", "exports", "./globaldeclarations", "./vector", "./blue", "./red", "./game", "./player", "./behavior"], function (require, exports, globaldeclarations_1, vector_1, blue_1, red_1, game_1, player_1, behavior_1) {
    "use strict";
    function clearScreen() {
        globaldeclarations_1.GAME_CTX.clearRect(0, 0, 640, 640);
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
    var Main = (function () {
        function Main() {
        }
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
                clearScreen();
                game.graph.drawVertexes();
                game.graph.drawBullets();
                game.graph.sumResetDelta();
                game.graph.updateCollisionBucket();
                game.graph.checkDead();
                game.increment();
            }
            requestAnimationFrame(Main.testGameLoop.bind(this, game, ctx));
        };
        return Main;
    }());
    var player = new player_1.Player(STARTING_UNITS_PLAYER);
    var enemy = new player_1.Player(STARTING_UNITS_ENEMY);
    var game = new game_1.Game(player, enemy, globaldeclarations_1.GAME_CANVAS, globaldeclarations_1.GAME_CTX);
    Main.testGameLoop(game, globaldeclarations_1.GAME_CTX);
});
//# sourceMappingURL=main.js.map