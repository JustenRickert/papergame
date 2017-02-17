//-*-mode:typescript-*-
// Local Variables:
// eval: (setq typescript-indent-level 2)
// End:
"use strict";
var globaldeclarations_1 = require("./globaldeclarations");
var vector_1 = require("./vector");
var main_1 = require("./main"); // Probably don't want this...
var blue_1 = require("./blue");
var graph_1 = require("./graph");
var behavior_1 = require("./behavior");
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
            // Vector.equalPosition(v.circle.pos, vertex.circle.pos));
            for (var _i = 0, _a = _this.graph.dead; _i < _a.length; _i++) {
                var v = _a[_i];
                if (circle === v.circle) {
                    return true;
                }
            }
            return false;
        };
        // The win condition is "Every enemy circle is dead, and some player circle
        // is not dead." This connective statement has a truth identity that is
        // early terminating, i.e. if one enemy circle is found to be alive, then
        // the rest of the algorithm is short circuited and the function instantly
        // returns false.
        this.winCondition = function () {
            return _this.graph.enemy.circle.every(function (c) { return _this.circleIsDead(c); })
                && _this.graph.player.circle.some(function (c) { return !_this.circleIsDead(c); });
        };
        // Should be obvious after reading the win condition.
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
