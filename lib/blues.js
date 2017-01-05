// -*- mode:typescript -*-
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlueCircle = (function (_super) {
    __extends(BlueCircle, _super);
    function BlueCircle(id) {
        var behaviors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behaviors[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, id, 20, new Vector(200, 300)) || this;
        _this.wander = new WanderCloselyBehavior(); // Default behavior
        _this.increment = function () {
            _this.timeAlive++;
        };
        _this.behave = function (c, g) {
            for (var _i = 0, _a = _this.behaviors; _i < _a.length; _i++) {
                var bhvr = _a[_i];
                if (bhvr.condition(c, g)) {
                    bhvr.consequence(c);
                    return;
                }
            }
            _this.wander.condition(c, g);
            _this.wander.consequence(c);
        };
        _this.behaviors = behaviors;
        _this.id = id;
        _this.color = "Blue";
        _this.timeAlive = 0;
        _this.life.maxHealth = 10;
        _this.life.health = _this.life.maxHealth;
        return _this;
    }
    return BlueCircle;
}(Circle));
var Blues = (function () {
    function Blues(count, gameCount) {
        var _this = this;
        this.increment = function () {
            for (var _i = 0, _a = _this.all; _i < _a.length; _i++) {
                var rc = _a[_i];
                rc.timeAlive++;
            }
        };
        this.positionAll = function () {
            for (var i = 0; i < _this.count; i++) {
                _this.all[i].position(canvas.width - 15, canvas.height - 15);
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
                var b = _a[_i];
                for (var _b = 0, _c = _this.all; _b < _c.length; _b++) {
                    var or = _c[_b];
                    if (b !== or) {
                        Circle.isThenClipping(or, b);
                    }
                }
            }
        };
        this.distanceTable = function () {
            var table = [];
            for (var i = 0; i < _this.count; i++) {
                table[i] = [];
                for (var j = 0; j < _this.count; j++) {
                    table[i].push(Infinity);
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
            this.all.push(new BlueCircle(i, new AttackBehavior()));
        }
        gameCount += count;
    }
    return Blues;
}());
