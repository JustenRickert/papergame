// -*- mode:typescript -*-
// NEW PROJECT WOOH

/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board. There will be two factions of
 * pieces which will correspond to the red side and the blue side. At first, the
 * game will be about having pieces that are good for fighting, then as you go
 * on economic pieces will be added, which will then allow upgrading units, and
 * even constructing new units from a factory. The game will be played by
 * assigning intelligence to the particular pieces---either to defend other
 * specific pieces, or attack unrelentingly---so that the end goal is one team
 * winning over the other. */

class Vector {
    constructor(
        public x: number,
        public y: number) {
    }
    // How do I use these in Circle?
    static times(k: number, v: Vector) {
        return new Vector(k * v.x, k * v.y);
    }
    static minus(v1: Vector, v2: Vector) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static plus(v1: Vector, v2: Vector) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static dot(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static mag(v: Vector): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static dist(v1: Vector, v2: Vector): number {
        return Vector.mag(Vector.minus(v2, v1))
    }
    static cross(v1: Vector, v2: Vector) {
        return v1.x * v2.y - v1.y * v2.x
    }
    // Returns an angle between [-pi, pi]. an angle of 0 corresponds to the two
    // vectors being the same.
    static angleBetween(v1: Vector, v2: Vector): number {
        // This is some magic, actually.
        return Math.atan2(Vector.cross(v1, v2), Vector.dot(v1, v2));
    }
    static directionTo(v1: Vector, v2: Vector): number {
        var angle = Vector.angleBetween(v1, v2);
        if (angle === 0) {
            return 0
        } else {
            return angle > 0 ? -1 : 1;
        }
    }
}
class State {
    constructor() { }
    public movement = true;
    public turn = true;
    public colliding = false;

    public collision(): boolean { // Not sure if I should use this, tbh
        return this.colliding;
    }
}

// Circles are cool!
class Circle {
    constructor(
        public radius: number,
        public pos: Vector,
        public vel: Vector = new Vector(0, 0),
        public acc: Vector = new Vector(0, 0),
        public color: string = 'Black',
        public bandColor: string = 'Black',
        public direction: number = 0,
        public speed: number = 2.0,
        public acc_value: number = 1.0,
        public turnRate: number = 0.1,
        public state: State = new State()) {
    }
    public move(new_x: number, new_y: number): void {
        this.pos = new Vector(new_x, new_y)
    }
    public moveForwardByVel(): void {
        this.pos = new Vector(
            this.pos.x + this.speed * this.vel.x,
            this.pos.y + this.speed * this.vel.y);
    }
    private adjustVelocityToDirection(): void {
        this.setVelocity(new Vector(Math.sin(this.direction), Math.cos(this.direction)));
    }
    public turn(delta): void {
        /* a positive value indicates turning clockwise,  */
        this.direction = Math.abs(this.direction + delta) >= 2 * Math.PI ?
            (this.direction + delta) % Math.PI : this.direction + delta;
        this.adjustVelocityToDirection();
    }
    public turnToPosition(pos: Vector): void {
        if (Math.abs(Vector.angleBetween(this.vel, Vector.minus(pos, this.pos))) > .07) {
            this.turn(this.turnRate * Vector.directionTo(this.vel, Vector.minus(pos, this.pos)));
        }
    }
    public setSpeed(spd: number): void {
        this.speed = spd;
    }
    public setVelocity(vel: Vector): void {
        this.vel = new Vector(vel.x, vel.y);
    }
    public addVelocity(vel: Vector): void {
        this.vel = new Vector(this.vel.x + vel.x, this.vel.y + vel.y);
    }
    public moveToPosition(pos: Vector): void {
        if (Vector.dist(this.pos, pos) > this.radius / 3) {
            this.moveForwardByVel();
        }
        this.turnToPosition(pos);
    }
    public draw(): void {
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
        CNTX.moveTo(
            this.pos.x + (3 * this.radius / 4) * Math.sin(this.direction),
            this.pos.y + (3 * this.radius / 4) * Math.cos(this.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        CNTX.lineTo(
            this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction + Math.PI / 3),
            this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction + Math.PI / 3));
        CNTX.lineTo(
            this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction - Math.PI / 3),
            this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction - Math.PI / 3));
        // color it in
        CNTX.fillStyle = this.bandColor;
        CNTX.fill();
        CNTX.closePath();
    }
    public setColliding() {
        this.state.colliding = true;
    }
    public unsetColliding() {
        this.state.colliding = false;
    }
    static isThenColliding(c1: Circle, c2: Circle): void {
        if (Circle.isColliding(c1, c2)) {
            c1.setColliding();
            c2.setColliding();
        } else {
            c1.unsetColliding();
            c2.unsetColliding();
        }
    }
    static isColliding(c1: Circle, c2: Circle): boolean {
        return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius
    }
}

// Blue is the good guys, but maybe add user changeable colors or something.
class BlueCircle extends Circle {
    constructor() {
        super(35, new Vector(0, 0))
        this.color = "Blue";
    }
    public follow(cir: Vector): void {
        this.moveToPosition(cir);
    }
}

// Red is the bad guys! Boo on them. They are a separate class because they are
// going to have separate functions from the blue guys.
class RedCircle extends Circle {
    public state: State;
    constructor() {
        super(20, new Vector(200, 300))
        this.color = "Red";
        this.state = new State();
    }
}

var CANV = document.createElement("canvas");
document.body.appendChild(CANV);

var LASTCLICK = new Vector(0, 0);
CANV.onclick = function updateLastClick(event) {
    LASTCLICK = new Vector(event.pageX, event.pageY)
};
CANV.width = 1925;
CANV.height = 2380;
var CNTX = CANV.getContext("2d");

var red = new RedCircle();
var blu = new BlueCircle();
red.setVelocity(new Vector(1, 0));
blu.setVelocity(new Vector(0.5, 0));
blu.setSpeed(0.5);
var GAME_FRAME = 0;

// I want this to be kind of a portable test service or something. I dunno,
// maybe I'll make an elaborate test module or something, too.
function start() {
    //Vector.minus(red.pos, new Vector(0, 0))))
    clearScreen();
    Circle.isThenColliding(red, blu);
    // console.log(red.state, blu.state);
    if (blu.state.colliding) {
    } else {
        blu.follow(red.pos);
    }
    if (red.state.colliding) {
        if (Math.abs(Vector.angleBetween(red.vel, Vector.minus(red.pos, blu.pos)))
            < Math.PI / 1.4) {// 1.4 is a kind of "squeeze" amount. It let's the one
            // circle move around the other circle. This is so far a naive way of dealing
            // with this, but it should be too hard to add a physics based "pushing"
            // affect simply on top of this.
            red.moveToPosition(LASTCLICK);
        } else {
            red.turnToPosition(LASTCLICK);
        }
    } else {
        red.moveToPosition(LASTCLICK);
    }

    red.draw();
    blu.draw();
    GAME_FRAME++;
    requestAnimationFrame(start);
} start()

// clears the screen, obvii
function clearScreen() {
    CNTX.clearRect(0, 0, CANV.width, CANV.height);
}

// draws a dot on the screen
function draw(x, y, rad, color) { // Probably deprecated.
    CNTX.beginPath();
    CNTX.arc(x, y, rad, 0, 2 * Math.PI);
    CNTX.closePath();
    CNTX.fillStyle = color;
    CNTX.fill();
}
