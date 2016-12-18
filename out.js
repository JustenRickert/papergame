var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
/* With this class I'm using the sort of outline they have for disjoint set data
 * structures and operations. */
var Game = (function () {
    function Game(redCount) {
        this.red = new Reds(redCount);
    }
    Game.prototype.run = function () {
        this.red.increment();
        // this.red.moveToPosition();
        this.behave();
    };
    Game.prototype.draw = function () {
        this.red.draw();
    };
    Game.prototype.spawnRed = function () {
        // spawns red dudes and then tells them what to do.
        this.red.positionAll();
    };
    Game.prototype.collision = function () {
        this.red.isThenClipping();
    };
    Game.prototype.updateDistanceTable = function () {
        this.distanceRed = this.red.distanceTable();
    };
    Game.prototype.bottomFiveDistance = function (r) {
        var id = [];
        if (this.distanceRed[r.id].length < 5) {
            for (var j in this.distanceRed[r.id]) {
                id.push(j);
            }
            return zip(id, this.distanceRed[r.id]);
        }
        var dist = [];
        for (var j = 0; j < 5; j++) {
            id.push(j);
            dist.push(this.distanceRed[r.id][j]);
        }
        var smallest = dist.indexOf(min(dist));
        for (var j = 5; j < this.distanceRed[r.id].length; j++) {
            if (this.distanceRed[r.id][j] > dist[smallest]) {
                dist[smallest] = this.distanceRed[r.id][j];
                id[smallest] = j;
                smallest = dist.indexOf(min(dist));
            }
        }
        return zip(id, dist);
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
    /* Returns the center of mass of closest five circles to the circle
     * argument. */
    Game.prototype.momentClosestFive = function (c) {
        var clstFivePos = [];
        var botmFive = this.bottomFiveDistance(c);
        for (var _i = 0, botmFive_1 = botmFive; _i < botmFive_1.length; _i++) {
            var e = botmFive_1[_i];
            clstFivePos.push(this.red.allRed[e[0]].pos);
        }
        return Game.moment(clstFivePos);
    };
    Game.prototype.behave = function () {
        for (var _i = 0, _a = this.red.allRed; _i < _a.length; _i++) {
            var r = _a[_i];
            r.behave(this);
        }
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
    function Circle(radius, pos, vel, phys, color, bandColor, direction, speed, acc_value, turnRate, state, lastPosition // this is set in detectSitting()
        ) {
        if (vel === void 0) { vel = new Vector(0, 0); }
        if (phys === void 0) { phys = new Physics(new Force(Math.PI * radius, new Vector(0, 0)), new Momentum(Math.PI * radius, new Vector(0, 0))); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 0; }
        if (speed === void 0) { speed = 2.5; }
        if (acc_value === void 0) { acc_value = 200.0; }
        if (turnRate === void 0) { turnRate = 0.07; }
        if (state === void 0) { state = new State(); }
        if (lastPosition === void 0) { lastPosition = new Vector(-1, -1); }
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.phys = phys;
        this.color = color;
        this.bandColor = bandColor;
        this.direction = direction;
        this.speed = speed;
        this.acc_value = acc_value;
        this.turnRate = turnRate;
        this.state = state;
        this.lastPosition = lastPosition;
        this.clippingForce = 0.011;
    }
    Circle.prototype.detectSitting = function () {
        if (Vector.dist(this.pos, this.lastPosition) <= .1) {
            State.sittingOn(this.state);
        }
        else {
            State.sittingOff(this.state);
        }
        this.lastPosition = this.pos;
    };
    Circle.prototype.move = function (new_x, new_y) {
        this.pos = new Vector(new_x, new_y);
    };
    Circle.prototype.moveForwardByVel = function () {
        this.pos = new Vector(this.pos.x + this.speed * this.vel.x, this.pos.y + this.speed * this.vel.y);
    };
    Circle.prototype.moveForwardByVec = function (vec) {
        this.pos = Vector.plus(this.pos, vec);
    };
    Circle.prototype.adjustVelocityToDirection = function () {
        this.setVel(new Vector(Math.sin(this.direction), Math.cos(this.direction)));
    };
    Circle.prototype.turn = function (delta) {
        /* a positive value indicates turning clockwise,  */
        this.direction = Math.abs(this.direction + delta) >= 2 * Math.PI ?
            (this.direction + delta) % Math.PI : this.direction + delta;
        this.adjustVelocityToDirection();
    };
    Circle.prototype.turnToPosition = function (pos) {
        if (Math.abs(Vector.angleBetween(this.vel, Vector.minus(pos, this.pos))) > 0.07) {
            this.turn(this.turnRate * Vector.directionTo(this.vel, Vector.minus(pos, this.pos)));
        }
    };
    Circle.prototype.setSpeed = function (spd) {
        this.speed = spd;
    };
    Circle.prototype.setVel = function (vel) {
        this.vel = new Vector(vel.x, vel.y);
    };
    Circle.prototype.addVel = function (vel) {
        this.vel = new Vector(this.vel.x + vel.x, this.vel.y + vel.y);
    };
    Circle.prototype.moveToPosition = function (pos) {
        this.turnToPosition(pos);
        if (Vector.angleBetween(this.vel, Vector.minus(pos, this.pos)) < .07) {
            if (Vector.dist(this.pos, pos) > .1 * this.radius) {
                this.moveForwardByVel();
            }
        }
    };
    Circle.prototype.draw = function () {
        // Draw the Circle
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        // color in the circle
        ctx.fillStyle = this.color;
        ctx.fill();
        // Draw the triangle at this.direction at half radius. I think I'm going
        // to make all projectiles squares. Triangles could be designated as
        // structures.
        ctx.beginPath();
        // forward point
        ctx.moveTo(this.pos.x + (3 * this.radius / 4) * Math.sin(this.direction), this.pos.y + (3 * this.radius / 4) * Math.cos(this.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        ctx.lineTo(this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction + Math.PI / 3), this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction + Math.PI / 3));
        ctx.lineTo(this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction - Math.PI / 3), this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction - Math.PI / 3));
        // color it in
        ctx.fillStyle = this.bandColor;
        ctx.fill();
        ctx.closePath();
    };
    Circle.prototype.setColliding = function () {
        this.state.colliding = true;
    };
    Circle.prototype.unsetColliding = function () {
        this.state.colliding = false;
        this.phys.force.vect = new Vector(0, 0);
    };
    Circle.prototype.lateralForceLeft = function () {
        this.phys.force.vect.x = this.acc_value * this.vel.y;
        this.phys.force.vect.y = this.acc_value * -this.vel.x;
    };
    Circle.prototype.lateralForceRight = function () {
        this.phys.force.vect.x = this.acc_value * this.vel.y;
        this.phys.force.vect.y = this.acc_value * -this.vel.x;
    };
    // A lateral movement increases the overall speed of the circle, but it
    // doesn't decrease the time it will take to get to the target. That's so
    // fucking interesting!
    Circle.lateralMoveRight = function (c) {
        c.pos = new Vector(c.pos.x - c.vel.y, c.pos.y + c.vel.x);
    };
    Circle.lateralMoveLeft = function (c) {
        c.pos = new Vector(c.pos.x + c.vel.y, c.pos.y - c.vel.x);
    };
    Circle.lateralForceLeft = function (c) {
        c.phys.force.vect.x = c.vel.y;
        c.phys.force.vect.y = -c.vel.x;
    };
    Circle.lateralForceRight = function (c) {
        c.phys.force.vect.x = -c.vel.y;
        c.phys.force.vect.y = c.vel.x;
    };
    Circle.prototype.moveMomentumVector = function () {
    };
    Circle.isThenClipping = function (c1, c2) {
        if (Circle.isColliding(c1, c2)) {
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
    Circle.isColliding = function (c1, c2) {
        return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
    };
    Circle.applyForce = function (c1, c2) {
        if (this.isColliding(c1, c2)) {
            var diff = Vector.dist(c1.pos, c2.pos) - c1.radius - c2.radius;
            var dirTo = Vector.minus(c1.pos, c2.pos);
            c1.phys.force.vect = Vector.times(-diff, dirTo);
            c2.phys.force.vect = Vector.times(diff, dirTo);
        }
    };
    Circle.prototype.impulse = function () {
        this.phys.momen.vect = Vector.plus(this.phys.momen.vect, this.phys.force.vect);
    };
    Circle.prototype.moveByMomentum = function () {
        this.moveForwardByVec(Vector.times(0.001, this.phys.momen.vect));
    };
    Circle.prototype.frictionMomentum = function (coeff) {
        /* coeff should be in (0,1) that's non-inclusive */
        this.phys.momen.vect = Vector.times(coeff, this.phys.momen.vect);
    };
    return Circle;
}());
var State = (function () {
    function State() {
        this.movement = true;
        this.turn = true;
        this.colliding = false;
        this.cqc = false;
        this.sitting = true;
    }
    State.sittingOn = function (st) {
        st.sitting = true;
    };
    State.sittingOff = function (st) {
        st.sitting = false;
    };
    return State;
}());
/* FORCE AND MOMENTUM
 *   I need force and momentum so I can do the physical interactions between the
 * circles. */
var Force = (function () {
    function Force(mass, vect) {
        this.mass = mass;
        this.vect = vect;
    }
    return Force;
}());
var Momentum = (function () {
    function Momentum(mass, vect) {
        this.mass = mass;
        this.vect = vect;
    }
    Momentum.prototype.vector = function () {
        return new Vector(this.mass * this.vect.x, this.mass * this.vect.y);
    };
    return Momentum;
}());
var Physics = (function () {
    function Physics(force, momen) {
        this.force = force;
        this.momen = momen;
    }
    return Physics;
}());
/* TIMED ACTION */
var UnitEvent = (function () {
    function UnitEvent(circle, affect, count, lastTrigger) {
        this.circle = circle;
        this.affect = affect;
        this.count = count;
        this.lastTrigger = lastTrigger;
    }
    UnitEvent.prototype.decrement = function () {
        this.count -= 1;
    };
    return UnitEvent;
}());
var SideStep = (function (_super) {
    __extends(SideStep, _super);
    function SideStep(circle, stepping, direction) {
        if (stepping === void 0) { stepping = 3; }
        if (direction === void 0) { direction = 'left'; }
        _super.call(this, circle, 'sideStep', 30);
        this.circle = circle;
        this.stepping = stepping;
        this.direction = direction;
    }
    SideStep.prototype.decrementStepping = function () {
        this.stepping -= 1;
    };
    SideStep.prototype.onZero = function () {
        this.decrementStepping();
        if (this.stepping > 0) {
            if (this.direction === 'left') {
                this.circle.lateralForceRight();
            }
            else if (this.direction === 'right') {
                this.circle.lateralForceLeft();
            }
            if (!this.circle.state.sitting) {
                if (this.direction === 'left') {
                    this.direction = 'right';
                }
                else {
                    this.direction = 'left';
                }
                this.count = 30;
                return;
            }
            this.circle.impulse();
            this.circle.moveByMomentum();
        }
        else if (this.direction === 'left') {
            this.stepping = 3;
            this.direction = 'right';
        }
        else {
            this.direction = 'left';
            this.count = 30;
        }
    };
    return SideStep;
}(UnitEvent));
var twitch = (function (_super) {
    __extends(twitch, _super);
    function twitch() {
        _super.apply(this, arguments);
    }
    return twitch;
}(UnitEvent));
/* These are to be the place to have all of the red circles and things */
var WanderCloselyBehavior = (function () {
    function WanderCloselyBehavior() {
        this.wanderRadius = 7;
    }
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    WanderCloselyBehavior.prototype.condition = function (rc, g) {
        this.positionToMove = game.momentClosestFive(rc);
        if (Vector.dist(this.positionToMove, rc.pos) > this.wanderRadius * rc.radius) {
            this.shouldRunToGroup = true;
        }
        else {
            this.shouldRunToGroup = false;
            if (!this.shouldWander) {
                this.willWander(rc);
            }
        }
        return true;
    };
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    WanderCloselyBehavior.prototype.consequence = function (rc) {
        if (this.shouldRunToGroup)
            this.runToGroup(rc);
        else if (this.shouldWander > 0)
            this.wander(rc);
    };
    WanderCloselyBehavior.prototype.runToGroup = function (rc) {
        rc.moveToPosition(this.positionToMove);
    };
    WanderCloselyBehavior.prototype.wander = function (rc) {
        rc.moveToPosition(this.wanderPosition);
        this.shouldWander--;
    };
    WanderCloselyBehavior.prototype.willWander = function (rc) {
        if (Math.random() < 0.1) {
            this.shouldWander = 60;
            this.wanderPosition =
                Vector.plus(this.positionToMove, Vector.times(this.wanderRadius * Math.random() * rc.radius, Vector.random()));
        }
    };
    return WanderCloselyBehavior;
}());
/* Move around the nearest circle clockwise, switching directions
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
// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
var RedCircle = (function (_super) {
    __extends(RedCircle, _super);
    function RedCircle(id) {
        var behavior = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behavior[_i - 1] = arguments[_i];
        }
        _super.call(this, 20, new Vector(200, 300));
        this.wander = new WanderCloselyBehavior();
        this.id = id;
        this.color = "Red";
        this.state = new State();
        this.timeAlive = 0;
    }
    RedCircle.prototype.increment = function () {
        this.timeAlive++;
    };
    RedCircle.prototype.behave = function (g) {
        this.wander.condition(this, g);
        this.wander.consequence(this);
    };
    return RedCircle;
}(Circle));
var Reds = (function () {
    function Reds(count) {
        this.count = count;
        this.allRed = [];
        for (var i = 0; i < this.count; i++) {
            this.allRed.push(new RedCircle(i));
        }
    }
    Reds.prototype.increment = function () {
        for (var _i = 0, _a = this.allRed; _i < _a.length; _i++) {
            var rc = _a[_i];
            rc.timeAlive++;
        }
    };
    Reds.prototype.positionAll = function () {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].move(330 + 20 * i, 250 + 20 * i);
        }
    };
    Reds.prototype.draw = function () {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].draw();
        }
    };
    Reds.prototype.moveToPosition = function () {
        for (var i = 0; i < this.count; i++) {
            this.allRed[i].moveToPosition(LASTCLICK);
        }
    };
    Reds.prototype.isThenClipping = function () {
        for (var _i = 0, _a = this.allRed; _i < _a.length; _i++) {
            var r = _a[_i];
            for (var _b = 0, _c = this.allRed; _b < _c.length; _b++) {
                var or = _c[_b];
                if (r !== or) {
                    Circle.isThenClipping(or, r);
                }
            }
        }
    };
    Reds.prototype.distanceTable = function () {
        var table = [];
        for (var i = 0; i < this.count; i++) {
            table[i] = [];
            for (var j = 0; i < this.count; i++) {
                table.push(Infinity);
            }
        }
        for (var i = 0; i < this.count; i++) {
            for (var j = 0; j < this.count; j++) {
                if (i !== j) {
                    table[i][j] = Vector.dist(this.allRed[i].pos, this.allRed[j].pos);
                }
            }
        }
        return table;
    };
    return Reds;
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
    clearScreen();
    game.collision();
    game.run();
    game.draw();
    requestAnimationFrame(start);
}
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var LASTCLICK = new Vector(0, 0);
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event);
    LASTCLICK = new Vector(mPos.x, mPos.y);
};
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
var game = new Game(7);
game.spawnRed();
start();
// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
// Blue is the good guys, but maybe add user changeable colors or something.
var BlueCircle = (function (_super) {
    __extends(BlueCircle, _super);
    function BlueCircle() {
        _super.call(this, 35, new Vector(500, 800));
        this.color = "Blue";
    }
    BlueCircle.prototype.follow = function (cir) {
        this.moveToPosition(cir);
    };
    return BlueCircle;
}(Circle));
