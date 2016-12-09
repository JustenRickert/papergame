var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
