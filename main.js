// -*- mode:typescript -*-
// NEW PROJECT WOOH
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board. There will be two factions of
 * pieces which will correspond to the red side and the blue side. At first, the
 * game will be about having pieces that are good for fighting, then as you go
 * on economic pieces will be added, which will then allow upgrading units, and
 * even constructing new units from a factory. The game will be played by
 * assigning intelligence to the particular pieces---either to defend other
 * specific pieces, or attack unrelentingly---so that the end goal is one team
 * winning over the other. */
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
// Circles are cool!
var Circle = (function () {
    function Circle(radius, pos, vel, acc, color, bandColor, direction, speed, turnRate) {
        if (vel === void 0) { vel = new Vector(0, 0); }
        if (acc === void 0) { acc = new Vector(0, 0); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 0; }
        if (speed === void 0) { speed = 2.0; }
        if (turnRate === void 0) { turnRate = 0.1; }
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.color = color;
        this.bandColor = bandColor;
        this.direction = direction;
        this.speed = speed;
        this.turnRate = turnRate;
    }
    Circle.prototype.move = function (new_x, new_y) {
        this.pos = new Vector(new_x, new_y);
    };
    Circle.prototype.moveForwardByVel = function () {
        this.pos = new Vector(this.pos.x + this.speed * this.vel.x, this.pos.y + this.speed * this.vel.y);
    };
    Circle.prototype.adjustVelocityToDirection = function () {
        this.setVelocity(new Vector(Math.sin(this.direction), Math.cos(this.direction)));
    };
    Circle.prototype.turn = function (delta) {
        /* a positive value indicates turning clockwise,  */
        this.direction = Math.abs(this.direction + delta) >= 2 * Math.PI ?
            (this.direction + delta) % Math.PI :
            this.direction + delta;
        this.adjustVelocityToDirection();
    };
    Circle.prototype.turnToPosition = function (pos) {
        if (Math.abs(Vector.angleBetween(this.vel, Vector.minus(pos, this.pos))) > .07) {
            this.turn(this.turnRate
                * Vector.directionTo(this.vel, Vector.minus(pos, this.pos)));
        }
    };
    Circle.prototype.setVelocity = function (vel) {
        this.vel = new Vector(vel.x, vel.y);
    };
    Circle.prototype.addVelocity = function (vel) {
        this.vel = new Vector(this.vel.x + vel.x, this.vel.y + vel.y);
    };
    Circle.prototype.moveToPosition = function (pos) {
        if (Vector.dist(this.pos, pos) > this.radius / 3) {
            this.moveForwardByVel();
        }
        this.turnToPosition(pos);
    };
    Circle.prototype.draw = function () {
        // Draw the Circle
        CNTX.beginPath();
        CNTX.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        CNTX.closePath();
        CNTX.fillStyle = this.color;
        CNTX.fill();
        // Draw the triangle at this.direction at half radius. I think I'm going
        // to make all projectiles squares. Triangles could be designated as
        // structures.
        CNTX.beginPath();
        // forward point
        CNTX.moveTo(this.pos.x + (3 * this.radius / 4) * Math.sin(this.direction), this.pos.y + (3 * this.radius / 4) * Math.cos(this.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        CNTX.lineTo(this.pos.x +
            (2 * this.radius / 4) * Math.sin(this.direction + Math.PI / 3), this.pos.y +
            (2 * this.radius / 4) * Math.cos(this.direction + Math.PI / 3));
        CNTX.lineTo(this.pos.x +
            (2 * this.radius / 4) * Math.sin(this.direction - Math.PI / 3), this.pos.y +
            (2 * this.radius / 4) * Math.cos(this.direction - Math.PI / 3));
        CNTX.fillStyle = this.bandColor;
        CNTX.fill();
        CNTX.closePath();
    };
    return Circle;
}());
// Blue is the good guys, but maybe add user changeable colors or something.
var BlueCircle = (function (_super) {
    __extends(BlueCircle, _super);
    function BlueCircle() {
        _super.call(this, 35, new Vector(0, 0));
        this.color = "Blue";
    }
    BlueCircle.prototype.follow = function (cir) {
        this.moveToPosition(cir);
    };
    return BlueCircle;
}(Circle));
var State = (function () {
    function State() {
        this.movement = true;
        this.turn = true;
    }
    return State;
}());
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
red.setVelocity(new Vector(1, 0));
blu.setVelocity(new Vector(1, 0));
var GAME_FRAME = 0;
// I want this to be kind of a portable test service or something. I dunno,
// maybe I'll make an elaborate test module or something, too.
function start() {
    //Vector.minus(red.pos, new Vector(0, 0))))
    clearScreen();
    blu.follow(red.pos);
    red.moveToPosition(LASTCLICK);
    red.draw();
    blu.draw();
    GAME_FRAME++;
    requestAnimationFrame(start);
}
start();
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
