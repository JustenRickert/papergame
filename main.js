// -*- mode:typescript -*-
// NEW PROJECT WOOH
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that the end goal
 * is one team winning over the other. */
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
    return Vector;
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
// Circles are cool!
var Circle = (function () {
    function Circle(radius, pos, vel, phys, color, bandColor, direction, speed, acc_value, turnRate, state, lastPosition // this is set in detectSitting()
        ) {
        if (vel === void 0) { vel = new Vector(0, 0); }
        if (phys === void 0) { phys = new Physics(new Force(Math.PI * radius, new Vector(0, 0)), new Momentum(Math.PI * radius, new Vector(0, 0))); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 0; }
        if (speed === void 0) { speed = 2.0; }
        if (acc_value === void 0) { acc_value = 200.0; }
        if (turnRate === void 0) { turnRate = 0.1; }
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
        if (Vector.dist(this.pos, pos) > this.radius / 10) {
            this.moveForwardByVel();
        }
        this.turnToPosition(pos);
    };
    Circle.prototype.draw = function () {
        // Draw the Circle
        CNTX.beginPath();
        CNTX.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        CNTX.closePath();
        // color in the circle
        CNTX.fillStyle = this.color;
        CNTX.fill();
        // Draw the triangle at this.direction at half radius. I think I'm going
        // to make all projectiles squares. Triangles could be designated as
        // structures.
        CNTX.beginPath();
        // forward point
        CNTX.moveTo(this.pos.x + (3 * this.radius / 4) * Math.sin(this.direction), this.pos.y + (3 * this.radius / 4) * Math.cos(this.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        CNTX.lineTo(this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction + Math.PI / 3), this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction + Math.PI / 3));
        CNTX.lineTo(this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction - Math.PI / 3), this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction - Math.PI / 3));
        // color it in
        CNTX.fillStyle = this.bandColor;
        CNTX.fill();
        CNTX.closePath();
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
    Circle.isThenColliding = function (c1, c2) {
        if (Circle.isColliding(c1, c2)) {
            c1.setColliding();
            c2.setColliding();
        }
        else {
            c1.unsetColliding();
            c2.unsetColliding();
        }
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
        this.moveForwardByVec(Vector.times(1 / this.phys.momen.mass, this.phys.momen.vect));
    };
    Circle.prototype.frictionMomentum = function (coeff) {
        /* coeff should be in (0,1) that's non-inclusive */
        this.phys.momen.vect = Vector.times(coeff, this.phys.momen.vect);
    };
    return Circle;
}());
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
// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
var RedCircle = (function (_super) {
    __extends(RedCircle, _super);
    function RedCircle() {
        _super.call(this, 20, new Vector(200, 300));
        this.color = "Red";
        this.state = new State();
    }
    return RedCircle;
}(Circle));
var CANV = document.createElement("canvas");
document.body.appendChild(CANV);
var LASTCLICK = new Vector(0, 0);
CANV.onclick = function updateLastClick(event) {
    LASTCLICK = new Vector(event.pageX, event.pageY);
};
CANV.width = 1925;
CANV.height = 2380;
var CNTX = CANV.getContext("2d");
var red = new RedCircle();
var blu = new BlueCircle();
var sideStep = new SideStep(red);
red.setVel(new Vector(1, 0));
blu.setVel(new Vector(0.5, 0));
blu.setSpeed(0.5);
var GAME_FRAME = 0;
var reds = new Reds(21);
// I want this to be kind of a portable test service or something. I dunno,
// maybe I'll make an elaborate test module or something, too.
function start() {
    for (var _i = 0, _a = reds.all; _i < _a.length; _i++) {
        var r = _a[_i];
        r.draw();
    }
    // Okay. So this is my first attempt at a thing called I am calling a Unit
    // Event. It's a time-based action that unfolds under certain conditions.
    // This one makes the red guy flip out. I think it's pretty naive, and it
    // doesn't seem to operate very well, but I'm sure things will get better
    // when I have a better understanding of a method that can accomplish
    // interesting things.
    red.detectSitting();
    if (red.state.sitting) {
        sideStep.decrement();
        if (sideStep.count > 0) {
        }
        else {
            sideStep.onZero();
        }
    }
    //Vector.minus(red.pos, new Vector(0, 0))))
    clearScreen();
    Circle.isThenColliding(red, blu);
    if (blu.state.colliding) {
    }
    else {
        blu.follow(red.pos);
    }
    if (red.state.colliding) {
        if (Math.abs(Vector.angleBetween(red.vel, Vector.minus(red.pos, blu.pos)))
            < Math.PI / 1.4) {
            // circle move around the other circle. This is so far a naive way
            // of dealing with this, but it shouldn't be too hard to add a
            // physics-based "pushing" affect simply on top of this. I am trying
            // to make a point of it because I think it should be easily seen,
            // as I don't know if I want to make it part of the Circle itself
            // just yet (and I don't want to just forget where this number is
            // located).
            red.moveToPosition(LASTCLICK);
            // In order to abstract these physics functions, we need a higher
            // order way of talking about the individual units, so that if there
            // is more than one collision happening, we can account for _all_ of
            // those interactions
            Circle.applyForce(red, blu);
            red.impulse(); // impulse is Force per time.
            blu.impulse(); // So this thing is starting to move more.
            red.moveByMomentum(); // This actually moves the point.
            blu.moveByMomentum();
        }
        else {
            red.turnToPosition(LASTCLICK);
        }
    }
    else {
        red.moveToPosition(LASTCLICK);
        red.unsetColliding(); // This is for the state
        blu.unsetColliding(); // Really, it should be blu.state.unsetColliding() {I think?}
        red.frictionMomentum(0.90); // Slows the thing down afterwards
        blu.frictionMomentum(0.90);
        red.moveByMomentum(); // Still needs to move, even if not colliding
        blu.moveByMomentum();
    }
    red.draw();
    blu.draw();
    GAME_FRAME++;
    requestAnimationFrame(start);
}
start();
// I don't use what is below this comment anymore, but I may be able generalize
// them, and then use them to draw everything.
// ALSO, be keeping these intensive drawing operations outside of classes, they
// can be moved to their own separate files wherein one can be certain the
// values have an immutable state, then the drawing operations can be called
// concurrently to increase the performance (I think? Maybe it won't matter).
// URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
// clears the screen, obvii
function clearScreen() {
    CNTX.clearRect(0, 0, CANV.width, CANV.height);
}
// draws a dot on the screen
function draw(x, y, rad, color) {
    CNTX.beginPath();
    CNTX.arc(x, y, rad, 0, 2 * Math.PI);
    CNTX.closePath();
    CNTX.fillStyle = color;
    CNTX.fill();
}
