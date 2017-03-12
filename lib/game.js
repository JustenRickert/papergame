define(["require", "exports", "./behavior", "./blue", "./graph", "./main", "./vector"], function (require, exports, behavior_1, blue_1, graph_1, main_1, vector_1) {
    "use strict";
    var Game = (function () {
        function Game(player, enemy, canvas, ctx) {
            var _this = this;
            this.running = true;
            this.won = false;
            this.lost = false;
            this.reinitialize = function (winOrLoss) {
                if (winOrLoss === 'win') {
                    var newCircle = new blue_1.BlueCircle(_this.graph.enemy.units.length
                        + _this.graph.player.units.length);
                    newCircle.behaviors = [new behavior_1.SimpleAimShootBehavior(), new behavior_1.AttackBehavior()];
                    var newCard = main_1.cardifyOne(newCircle);
                    _this.graph.enemy.units.push(newCard);
                    _this.graph.enemy.circle.push(newCircle);
                }
                else if (winOrLoss === 'loss') {
                    _this.graph.enemy.units.pop();
                    _this.graph.enemy.circle.pop();
                }
                _this.frame = 0;
                _this.graph.clearBullets();
                _this.graph.player.circle.forEach(function (c) { return c.color = c.dColor; });
                _this.graph.enemy.circle.forEach(function (c) { return c.color = c.dColor; });
                _this.graph.player.circle.forEach(function (c) { return c.life.health = c.life.maxHealth; });
                _this.graph.enemy.circle.forEach(function (c) { return c.life.health = c.life.maxHealth; });
                _this.graph.player.circle.forEach(function (c) { return c.pos = new vector_1.Vector(0, 0); });
                _this.graph.enemy.circle
                    .forEach(function (c) { return c.pos = new vector_1.Vector(_this.canvas.width, _this.canvas.height); });
                _this.graph.reinitializeBehaviors();
                _this.graph = new graph_1.Graph(_this.graph.player, _this.graph.enemy, _this.ctx);
                _this.graph.reinitializeBehaviors();
            };
            this.increment = function () { _this.frame++; };
            this.run = function () {
                _this.increment();
            };
            this.circleIsDead = function (circle) {
                for (var _i = 0, _a = _this.graph.dead; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (circle === v.circle) {
                        return true;
                    }
                }
                return false;
            };
            this.ctx = ctx;
            this.canvas = canvas;
            this.circles = player.circles().concat(enemy.circles());
            this.graph = new graph_1.Graph(player, enemy, ctx);
            this.frame = 0;
        }
        return Game;
    }());
    Game.size = { height: 640, width: 640 };
    Game.winCondition = function (game) {
        return game.graph.enemy.circle.every(function (c) { return game.circleIsDead(c); })
            && game.graph.player.circle.some(function (c) { return !game.circleIsDead(c); });
    };
    Game.loseCondition = function (game) {
        return game.graph.player.circle.every(function (c) { return game.circleIsDead(c); })
            && game.graph.enemy.circle.some(function (c) { return !game.circleIsDead(c); });
    };
    exports.Game = Game;
});
//# sourceMappingURL=game.js.map