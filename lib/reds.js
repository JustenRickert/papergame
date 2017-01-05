// -*- mode:typescript -*-
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* These are to be the place to have all of the red circles and things */
/* RedCircle is going to be the base class for all friendly circles. The default
 * behavior of red circles will be to wander closely to the nearest five
 * friendly units. Otherwise, this circle is just fucking bag of meat awaiting
 * death. */
var RedCircle = (function (_super) {
    __extends(RedCircle, _super);
    function RedCircle(id) {
        var behaviors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behaviors[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, id, 20, new Vector(200, 300)) || this;
        _this.wander = new WanderCloselyBehavior(); // Default behavior
        _this.behaviors = behaviors;
        _this.id = id;
        _this.color = "Red";
        _this.timeAlive = 0;
        _this.life.maxHealth = 10;
        _this.life.health = _this.life.maxHealth;
        return _this;
    }
    RedCircle.prototype.increment = function () {
        this.timeAlive++;
    };
    RedCircle.prototype.behave = function (c, g) {
        for (var _i = 0, _a = this.behaviors; _i < _a.length; _i++) {
            var bhvr = _a[_i];
            if (bhvr.condition(c, g)) {
                bhvr.consequence(c);
                return;
            }
        }
        if (this.wander.condition(c, g)) {
            this.wander.consequence(c);
            return;
        }
    };
    return RedCircle;
}(Circle));
var Reds = (function () {
    function Reds(count, gameCount) {
        var _this = this;
        this.increment = function () {
            for (var _i = 0, _a = _this.all; _i < _a.length; _i++) {
                var rc = _a[_i];
                rc.timeAlive++;
            }
        };
        this.positionAll = function () {
            for (var i = 0; i < _this.count; i++) {
                _this.all[i].position(15, 15);
            }
        };
        this.draw = function () {
            for (var i = 0; i < _this.count; i++) {
                _this.all[i].draw();
            }
        };
        this.moveToPosition = function (v) {
            for (var i = 0; i < _this.count; i++) {
                _this.all[i].moveToPosition(v);
            }
        };
        this.isThenClipping = function () {
            for (var _i = 0, _a = _this.all; _i < _a.length; _i++) {
                var r = _a[_i];
                for (var _b = 0, _c = _this.all; _b < _c.length; _b++) {
                    var or = _c[_b];
                    if (r !== or) {
                        Circle.isThenClipping(or, r);
                    }
                }
            }
        };
        this.distanceTable = function () {
            var table = [];
            for (var i = 0; i < _this.count; i++) {
                table[i] = [];
                for (var j = 0; j < _this.count; j++) {
                    table.push(Infinity);
                }
            }
            for (var i = 0; i < _this.count; i++) {
                for (var j = 0; j < _this.count; j++) {
                    if (i !== j) {
                        table[i][j] = Vector.dist(_this.all[i].pos, _this.all[j].pos);
                    }
                }
            }
            return table;
        };
        this.count = count;
        this.all = [];
        for (var i = 0; i < count; i++) {
            this.all.push(new RedCircle(i, new AttackBehavior()));
        }
        gameCount += count;
    }
    return Reds;
}());
