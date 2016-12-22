var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// -*- mode:typescript -*-
var Life = (function () {
    function Life(maxHealth) {
        var _this = this;
        this.damage = function (d) {
            if (_this.health - d < 0)
                _this.health = 0;
            else
                _this.health -= d;
        };
        this.heal = function (h) {
            if (_this.health + h < _this.maxHealth)
                _this.health += h;
            else
                _this.health = _this.maxHealth;
        };
        this.maxHealth = maxHealth;
    }
    return Life;
}());
var BasicAttack = (function () {
    function BasicAttack(d) {
        var _this = this;
        this.attackRate = 400;
        this.canAttack = function () { return game.frame - _this.lastAttack > _this.attackRate; };
        this.attack = function (c) {
            c.life.damage(_this.damage);
            _this.lastAttack = game.frame;
        };
        this.damage = d;
        this.lastAttack = 0;
    }
    return BasicAttack;
}());
var Effect = (function () {
    function Effect() {
    }
    return Effect;
}());
// -*- mode:typescript -*-
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    // How do I use these in Circle?
    Vector.times = function (k, v) {
        return new Vector(k * v.x, k * v.y);
    };
    Vector.minus = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    Vector.plus = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    Vector.mag = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    Vector.dist = function (v1, v2) {
        return Vector.mag(Vector.minus(v2, v1));
    };
    Vector.cross = function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    };
    // Returns an angle between [-pi, pi]. an angle of 0 corresponds to the two
    // vectors being the same.
    Vector.angleBetween = function (v1, v2) {
        // This is some magic, actually.
        return Math.atan2(Vector.cross(v1, v2), Vector.dot(v1, v2));
    };
    Vector.directionTo = function (v1, v2) {
        var angle = Vector.angleBetween(v1, v2);
        if (angle === 0) {
            return 0;
        }
        else {
            return angle > 0 ? -1 : 1;
        }
    };
    Vector.random = function () {
        return new Vector(2 * Math.random() - 1, 2 * Math.random() - 1);
    };
    return Vector;
}());
// -*-mode:typescript-*-
var Game = (function () {
    function Game(redCount, blueCount) {
        var _this = this;
        this.redBlueIsThenClipping = function () {
            for (var _i = 0, _a = _this.red.all; _i < _a.length; _i++) {
                var r = _a[_i];
                for (var _b = 0, _c = _this.blue.all; _b < _c.length; _b++) {
                    var b = _c[_b];
                    Circle.isThenClipping(r, b);
                }
            }
        };
        this.increment = function () { _this.frame++; };
        this.run = function () {
            _this.increment();
            _this.red.increment();
            _this.blue.increment();
            _this.behave();
        };
        this.draw = function () {
            _this.red.draw();
            _this.blue.draw();
        };
        this.spawnRed = function () {
            // spawns red dudes and then tells them what to do.
            _this.red.positionAll();
        };
        this.spawnBlue = function () {
            // spawns red dudes and then tells them what to do.
            _this.blue.positionAll();
        };
        this.collision = function () {
            _this.red.isThenClipping();
            _this.blue.isThenClipping();
            _this.redBlueIsThenClipping();
        };
        this.closestCircle = function (c, color) {
            if (color) {
                var group = {
                    'Red': _this.red.all,
                    'Blue': _this.blue.all
                }[color];
            }
            var minC;
            var dist;
            for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                var otherC = group_1[_i];
                if (c !== otherC) {
                    if (!minC)
                        minC = otherC;
                    dist = Vector.dist(c.pos, otherC.pos);
                }
                else
                    dist = Infinity;
                if (dist && Vector.dist(c.pos, minC.pos) > dist) {
                    minC = otherC;
                }
            }
            return minC;
        };
        this.bottomFiveDistance = function (c, color) {
            var distance = {
                'Red': _this.distanceRed[c.id],
                'Blue': _this.distanceBlue[c.id]
            }[color];
            var id = [];
            if (distance.length <= 5) {
                for (var j in distance) {
                    id.push(j);
                }
                return zip(id, distance);
            }
            var dist = [];
            for (var j = 0; j < 5; j++) {
                id.push(j);
                dist.push(distance[j]);
            }
            var smallest = dist.indexOf(min(dist));
            for (var j = 5; j < distance.length; j++) {
                if (distance[j] > dist[smallest]) {
                    dist[smallest] = distance[j];
                    id[smallest] = j;
                    smallest = dist.indexOf(min(dist));
                }
            }
            return zip(id, dist);
        };
        /* Returns the center of mass of closest five circles to the circle
         * argument. */
        this.momentClosestFive = function (c, color) {
            var clstFivePos = [];
            var botmFive = _this.bottomFiveDistance(c, color);
            for (var _i = 0, botmFive_1 = botmFive; _i < botmFive_1.length; _i++) {
                var e = botmFive_1[_i];
                var all = {
                    'Red': _this.red.all,
                    'Blue': _this.blue.all
                }[color];
                clstFivePos.push(all[e[0]].pos);
            }
            return Game.moment(clstFivePos);
        };
        this.behave = function () {
            for (var _i = 0, _a = _this.red.all; _i < _a.length; _i++) {
                var r = _a[_i];
                r.behave(r, _this);
            }
            for (var _b = 0, _c = _this.blue.all; _b < _c.length; _b++) {
                var b = _c[_b];
                b.behave(b, _this);
            }
        };
        this.gameCount = redCount + blueCount;
        this.red = new Reds(redCount, this.gameCount);
        this.blue = new Blues(blueCount, this.gameCount);
        this.frame = 0;
    }
    Game.prototype.updateDistanceTable = function () {
        this.distanceRed = this.red.distanceTable();
        this.distanceBlue = this.blue.distanceTable();
    };
    /* Returns the center of mass. All of the circles have the same mass, so
     * it's a little silly to call it by that name (it is rather, the center of
     * all the points), but it's convenient anyways now that you know what I'm
     * talking about, hopefully. */
    Game.moment = function (pos) {
        var sum = new Vector(0, 0);
        for (var _i = 0, pos_1 = pos; _i < pos_1.length; _i++) {
            var p = pos_1[_i];
            sum = Vector.plus(sum, p);
        }
        return Vector.times(1 / pos.length, sum);
    };
    return Game;
}());
/* HELPER FUNCTIONS
 *
 *     These are functions I use for conveniency and cause it makes me look cool
 *     that I ask for help. */
var min = function (arr) { return arr.reduce(function (a, b, i, arr) {
    if (a !== undefined && b !== undefined)
        return Math.min(a, b);
    else
        return a === undefined ? b : a;
}); };
var combin2 = function (arr) {
    var combs = [];
    for (var i = 0; i < arr.length; i++)
        for (var j = i + 1; j < arr.length; j++)
            if (i !== j) {
                combs.push(arr[i], arr[j]);
            }
    return combs;
};
var zip = function (a1, a2) { return a1.map(function (x, i) { return [x, a2[i]]; }); };
var combine = function (a) {
    var fn = function (n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    };
    var all = [];
    for (var i = 0; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
};
// Circles are cool!
var Circle = (function () {
    function Circle(id, radius, pos, vel, color, bandColor, direction, speed, turnRate) {
        var _this = this;
        if (vel === void 0) { vel = Vector.random(); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 4 * Math.PI * Math.random() - 2 * Math.PI; }
        if (speed === void 0) { speed = 2.5; }
        if (turnRate === void 0) { turnRate = 0.07; }
        this.id = id;
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.color = color;
        this.bandColor = bandColor;
        this.direction = direction;
        this.speed = speed;
        this.turnRate = turnRate;
        this.clippingForce = 0.011;
        this.life = new Life(-1);
        this.position = function (new_x, new_y) {
            _this.pos = new Vector(new_x, new_y);
        };
        this.moveForwardByVel = function () {
            _this.pos = new Vector(_this.pos.x + _this.speed * _this.vel.x, _this.pos.y + _this.speed * _this.vel.y);
        };
        this.moveForwardByScalarVel = function (scalar) {
            _this.pos = new Vector(_this.pos.x + _this.speed * scalar * _this.vel.x, _this.pos.y + _this.speed * scalar * _this.vel.y);
        };
        this.moveForwardByVec = function (vec) {
            _this.pos = Vector.plus(_this.pos, vec);
        };
        this.adjustVelocityToDirection = function () {
            _this.setVel(new Vector(Math.sin(_this.direction), Math.cos(_this.direction)));
        };
        this.turn = function (delta) {
            /* a positive value indicates turning clockwise,  */
            _this.direction = Math.abs(_this.direction + delta) >= 2 * Math.PI ?
                (_this.direction + delta) % Math.PI : _this.direction + delta;
            _this.adjustVelocityToDirection();
        };
        this.turnToPosition = function (pos) {
            if (Math.abs(Vector.angleBetween(_this.vel, Vector.minus(pos, _this.pos))) > 0.07) {
                _this.turn(_this.turnRate * Vector.directionTo(_this.vel, Vector.minus(pos, _this.pos)));
            }
        };
        this.setSpeed = function (spd) {
            _this.speed = spd;
        };
        this.setVel = function (vel) {
            _this.vel = new Vector(vel.x, vel.y);
        };
        this.addVel = function (vel) {
            _this.vel = new Vector(_this.vel.x + vel.x, _this.vel.y + vel.y);
        };
        this.moveToPosition = function (pos) {
            _this.turnToPosition(pos);
            if (Vector.angleBetween(_this.vel, Vector.minus(pos, _this.pos)) < .07) {
                if (Vector.dist(_this.pos, pos) > .1 * _this.radius) {
                    _this.moveForwardByVel();
                }
            }
        };
        this.draw = function () {
            // Draw the Circle
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI);
            ctx.closePath();
            // color in the circle
            ctx.fillStyle = _this.color;
            ctx.fill();
            // Draw the triangle at this.direction at half radius. I think I'm going
            // to make all projectiles squares. Triangles could be designated as
            // structures.
            ctx.beginPath();
            // forward point
            ctx.moveTo(_this.pos.x + (3 * _this.radius / 4) * Math.sin(_this.direction), _this.pos.y + (3 * _this.radius / 4) * Math.cos(_this.direction));
            // point to the left (or right, I dunno and it doesn't matter)
            ctx.lineTo(_this.pos.x + (2 * _this.radius / 4) * Math.sin(_this.direction + Math.PI / 3), _this.pos.y + (2 * _this.radius / 4) * Math.cos(_this.direction + Math.PI / 3));
            ctx.lineTo(_this.pos.x + (2 * _this.radius / 4) * Math.sin(_this.direction - Math.PI / 3), _this.pos.y + (2 * _this.radius / 4) * Math.cos(_this.direction - Math.PI / 3));
            // color it in
            ctx.fillStyle = _this.bandColor;
            ctx.fill();
            ctx.closePath();
        };
        // if (!this.direction)
        // this.vel = Vector.random();
        // this.direction = 4 * Math.PI * Math.random() - 2 * Math.PI;
    }
    Circle.isThenClipping = function (c1, c2) {
        if (Circle.isClipping(c1, c2)) {
            Circle.clippingPush(c1, c2);
        }
    };
    Circle.clippingPush = function (c1, c2) {
        var dist = Vector.dist(c1.pos, c2.pos);
        var dirTo = Vector.minus(c1.pos, c2.pos);
        var c1Force = dirTo;
        var c2Force = Vector.times(-1, dirTo);
        if (dist < (c1.radius + c2.radius) / 2) {
            c1.moveForwardByVec(Vector.times(15 * c1.clippingForce, c1Force));
            c2.moveForwardByVec(Vector.times(15 * c2.clippingForce, c2Force));
        }
        c1.moveForwardByVec(Vector.times(c1.clippingForce, c1Force));
        c2.moveForwardByVec(Vector.times(c2.clippingForce, c2Force));
    };
    // These static methods need to be in Circle, and not Vector, because they
    // need access to Circle.radius and other attributes.
    Circle.isClipping = function (c1, c2) {
        return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
    };
    return Circle;
}());
// -*- mode:typescript -*-
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
        _super.call(this, id, 20, new Vector(200, 300));
        this.wander = new WanderCloselyBehavior(); // Default behavior
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Red";
        this.timeAlive = 0;
        this.life.maxHealth = 10;
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
                _this.all[i].position(330 + 20 * i, 250 + 20 * i);
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
            this.all.push(new RedCircle(i));
        }
        gameCount += count;
    }
    return Reds;
}());
// -*- mode:typescript -*-
var BlueCircle = (function (_super) {
    __extends(BlueCircle, _super);
    function BlueCircle(id) {
        var _this = this;
        var behaviors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behaviors[_i - 1] = arguments[_i];
        }
        _super.call(this, id, 20, new Vector(200, 300));
        this.wander = new WanderCloselyBehavior(); // Default behavior
        this.increment = function () {
            _this.timeAlive++;
        };
        this.behave = function (c, g) {
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
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Blue";
        this.timeAlive = 0;
        this.life.maxHealth = 10;
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
                _this.all[i].position(500 + 20 * i, 250);
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
// -*- mode:typescript -*-
var AttackBehavior = (function () {
    function AttackBehavior() {
        var _this = this;
        this.bAttack = new BasicAttack(1);
        this.attackRange = 3;
        this.lungeVelocity = 3;
        this.condition = function (c, g) {
            if (_this.bAttack.canAttack()) {
                var opposingColor = {
                    'Red': 'Blue',
                    'Blue': 'Red'
                }[c.color];
                _this.targetC = game.closestCircle(c, opposingColor);
                return true;
            }
            return false;
        };
        this.consequence = function (attackC) {
            // Is the attacking circle close to the defending circle?
            if (Vector.dist(attackC.pos, _this.targetC.pos) > _this.attackRange * attackC.radius)
                attackC.moveToPosition(_this.targetC.pos);
            else if (Vector.angleBetween(attackC.vel, Vector.minus(_this.targetC.pos, attackC.pos)) < .07)
                _this.lungeAndAttack(attackC);
            else
                attackC.turnToPosition(_this.targetC.pos);
        };
        this.lungeAndAttack = function (attackC) {
            attackC.moveForwardByScalarVel(_this.lungeVelocity);
            if (Circle.isClipping(attackC, _this.targetC)) {
                _this.bAttack.attack(_this.targetC);
            }
        };
    }
    return AttackBehavior;
}());
/* Ugh. So this took a lot more work than I thought that it would take. Maybe
 * there's an easier way to go about this. I think this will work a lot better
 * in conjunction with other behaviors. I want this behavior to be the default
 * behavior for circles. */
var WanderCloselyBehavior = (function () {
    function WanderCloselyBehavior() {
        this.shouldWander = 60;
        this.wanderRadius = 7;
        this.positionToMove = Vector.times(640, Vector.random());
        this.wanderPosition = Vector.times(640, Vector.random());
    }
    WanderCloselyBehavior.prototype.outOfBoundCheck = function (c) {
        if (this.positionToMove.x < 4 * c.radius ||
            this.positionToMove.x > canvas.width - 4 * c.radius ||
            this.positionToMove.y < 4 * c.radius ||
            this.positionToMove.y > canvas.height - 4 * c.radius) {
            return true;
        }
        else
            return false;
    };
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    WanderCloselyBehavior.prototype.condition = function (c, g) {
        this.positionToMove = game.momentClosestFive(c, c.color);
        if (Vector.dist(this.positionToMove, c.pos) > this.wanderRadius * c.radius) {
            this.shouldRunToGroup = true;
        }
        else {
            this.shouldRunToGroup = false;
            if (this.shouldWander < 0) {
                this.willWander(c);
            }
        }
        return true;
    };
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    WanderCloselyBehavior.prototype.consequence = function (c) {
        if (this.outOfBoundCheck(c))
            c.moveToPosition(new Vector(320, 320));
        if (this.shouldRunToGroup)
            this.runToGroup(c);
        else if (this.shouldWander >= 0) {
            this.wander(c);
            this.shouldWander--;
        }
    };
    WanderCloselyBehavior.prototype.runToGroup = function (c) {
        c.moveToPosition(this.positionToMove);
    };
    WanderCloselyBehavior.prototype.wander = function (c) {
        c.moveToPosition(this.wanderPosition);
    };
    WanderCloselyBehavior.prototype.willWander = function (c) {
        if (Math.random() < 0.001) {
            this.shouldWander = 60;
            this.wanderPosition =
                Vector.plus(this.positionToMove, Vector.times(3 * this.wanderRadius * Math.random() * c.radius, Vector.random()));
        }
    };
    return WanderCloselyBehavior;
}());
/* TODO: Move around the nearest circle clockwise, switching directions
 * periodically. */
var circleBehavior = (function () {
    function circleBehavior() {
    }
    // Do the circling behavior always
    circleBehavior.prototype.condition = function () {
        return true;
    };
    // Move around the nearest circle clockwise, switching directions
    // periodically.
    circleBehavior.prototype.consequence = function () {
        return;
    };
    return circleBehavior;
}());
// -*- mode:typescript -*-
// NEW PROJECT WOOH
/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that the end goal
 * is one team winning over the other. */
function start() {
    game.frame++;
    game.updateDistanceTable();
    // console.log(
    //     game.bottomFiveDistance(game.red.all[0]),
    //     game.momentClosestFive(game.red.all[0]))
    clearScreen(); // TODO: There is better way to do this, clearing the screen
    // is pretty intensive, apparently. Also, the circles and
    // things don't need to be drawn every frame. They can just
    // moved around, but that should be easy to do later.
    game.collision();
    game.run();
    game.draw();
    requestAnimationFrame(start);
}
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event);
    LASTCLICK = new Vector(mPos.x, mPos.y);
};
var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
var game = new Game(4, 4);
game.spawnRed();
start();
// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
