define(["require", "exports", "./vector", "./life"], function (require, exports, vector_1, life_1) {
    "use strict";
    var Circle = (function () {
        function Circle(id, radius, pos, dPos, vel, teamColor, dColor, color, triangleColor, direction, speed, turnRate) {
            if (dPos === void 0) { dPos = new vector_1.Vector(0, 0); }
            if (vel === void 0) { vel = vector_1.Vector.random(); }
            if (teamColor === void 0) { teamColor = 'Black'; }
            if (dColor === void 0) { dColor = 'Black'; }
            if (color === void 0) { color = 'Black'; }
            if (triangleColor === void 0) { triangleColor = 'Black'; }
            if (direction === void 0) { direction = Math.PI / 2; }
            if (speed === void 0) { speed = 2.5; }
            if (turnRate === void 0) { turnRate = 0.07; }
            var _this = this;
            this.id = id;
            this.radius = radius;
            this.pos = pos;
            this.dPos = dPos;
            this.vel = vel;
            this.teamColor = teamColor;
            this.dColor = dColor;
            this.color = color;
            this.triangleColor = triangleColor;
            this.direction = direction;
            this.speed = speed;
            this.turnRate = turnRate;
            this.clippingForce = 0.075;
            this.life = new life_1.Life(25);
            this.addBehavior = function (behavior) {
                _this.behaviors.push(behavior);
            };
            this.position = function (newX, newY) {
                _this.pos = new vector_1.Vector(newX, newY);
            };
            this.moveForwardByVel = function () {
                _this.pos = new vector_1.Vector(_this.pos.x + _this.speed * _this.vel.x, _this.pos.y + _this.speed * _this.vel.y);
            };
            this.moveForwardByScalarVel = function (scalar, graph) {
                graph.addDelta(graph.indexOfCircle(_this), new vector_1.Vector(_this.speed * scalar * _this.vel.x, _this.speed * scalar * _this.vel.y));
            };
            this.moveForwardByVec = function (vec) {
                _this.pos = vector_1.Vector.plus(_this.pos, vec);
            };
            this.adjustVelocityToDirection = function () {
                _this.setVel(new vector_1.Vector(Math.sin(_this.direction), Math.cos(_this.direction)));
            };
            this.turn = function (delta) {
                _this.direction = Math.abs(_this.direction + delta) >= 2 * Math.PI ?
                    (_this.direction + delta) % Math.PI : _this.direction + delta;
                _this.adjustVelocityToDirection();
            };
            this.turnToPosition = function (pos) {
                if (Math.abs(vector_1.Vector.angleBetween(_this.vel, vector_1.Vector.minus(pos, _this.pos))) > 0.01) {
                    _this.turn(_this.turnRate * vector_1.Vector.angularDirectionTo(_this.vel, vector_1.Vector.minus(pos, _this.pos)));
                }
            };
            this.setSpeed = function (spd) {
                _this.speed = spd;
            };
            this.setVel = function (vel) {
                _this.vel = new vector_1.Vector(vel.x, vel.y);
            };
            this.addVel = function (vel) {
                _this.vel = new vector_1.Vector(_this.vel.x + vel.x, _this.vel.y + vel.y);
            };
            this.moveToPosition = function (pos, graph) {
                _this.turnToPosition(pos);
                if (_this.angleToPosition(pos) < 0.1) {
                    graph.addDelta(graph.indexOfCircle(_this), new vector_1.Vector(_this.speed * _this.vel.x, _this.speed * _this.vel.y));
                }
            };
            this.angleToCircle = function (otherC) {
                return vector_1.Vector.angleBetween(_this.vel, vector_1.Vector.minus(otherC.pos, _this.pos));
            };
            this.angleToPosition = function (v) {
                return vector_1.Vector.angleBetween(_this.vel, vector_1.Vector.minus(v, _this.pos));
            };
            this.isDead = function () { return _this.life.health === 0; };
            this.isAlive = function () { return _this.life.health !== 0 && _this.life.health !== NaN; };
            this.markDead = function () {
                _this.alive = false;
            };
            this.reinitializeBehaviors = function () {
                for (var _i = 0, _a = _this.behaviors; _i < _a.length; _i++) {
                    var b = _a[_i];
                    b.reinitialize(_this.pos);
                }
            };
            this.behave = function (v, game) {
                if (v.circle.life.health === 0) {
                    return;
                }
                for (var _i = 0, _a = _this.behaviors; _i < _a.length; _i++) {
                    var b = _a[_i];
                    if (b.condition(v, game)) {
                        b.consequence(v, game);
                        return;
                    }
                }
            };
            this.alive = true;
        }
        return Circle;
    }());
    Circle.isDead = function (c) { return c.life.health === 0; };
    Circle.isAlive = function (c) { return c.life.health !== 0 && c.life.health !== NaN; };
    Circle.isThenClipping = function (c1, c2) {
        if (Circle.isClipping(c1, c2)) {
            Circle.clippingPush(c1, c2);
        }
    };
    Circle.clippingPush = function (c1, c2) {
        var dirTo = vector_1.Vector.minus(c1.pos, c2.pos);
        var c1Force = dirTo;
        var c2Force = vector_1.Vector.times(-1, dirTo);
        c1.moveForwardByVec(vector_1.Vector.times(c1.clippingForce, c1Force));
        c2.moveForwardByVec(vector_1.Vector.times(c2.clippingForce, c2Force));
    };
    Circle.isClipping = function (c1, c2) {
        return vector_1.Vector.distance(c1.pos, c2.pos) < c1.radius + c2.radius;
    };
    exports.Circle = Circle;
});
//# sourceMappingURL=circle.js.map