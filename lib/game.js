define(["require", "exports", "./globaldeclarations", "./vector", "./main", "./blue", "./graph", "./behavior"], function (require, exports, globaldeclarations_1, vector_1, main_1, blue_1, graph_1, behavior_1) {
    "use strict";
    var Game = (function () {
        function Game(player, enemy) {
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
                _this.graph.player.circle.forEach(function (c) { return c.color = "red"; });
                _this.graph.enemy.circle.forEach(function (c) { return c.color = "blue"; });
                _this.graph.player.circle.forEach(function (c) { return c.life.health = c.life.maxHealth; });
                _this.graph.enemy.circle.forEach(function (c) { return c.life.health = c.life.maxHealth; });
                _this.graph.player.circle.forEach(function (c) { return c.pos = new vector_1.Vector(0, 0); });
                _this.graph.enemy.circle.forEach(function (c) { return c.pos = new vector_1.Vector(globaldeclarations_1.canvas.width, globaldeclarations_1.canvas.height); });
                _this.graph.reinitializeBehaviors();
                _this.graph = new graph_1.Graph(_this.graph.player, _this.graph.enemy);
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
            this.winCondition = function () {
                return _this.graph.enemy.circle.every(function (c) { return _this.circleIsDead(c); })
                    && _this.graph.player.circle.some(function (c) { return !_this.circleIsDead(c); });
            };
            this.loseCondition = function () {
                return _this.graph.player.circle.every(function (c) { return _this.circleIsDead(c); })
                    && _this.graph.enemy.circle.some(function (c) { return !_this.circleIsDead(c); });
            };
            this.circles = player.circles().concat(enemy.circles());
            this.graph = new graph_1.Graph(player, enemy);
            this.frame = 0;
        }
        return Game;
    }());
    exports.Game = Game;
});
//# sourceMappingURL=game.js.map