
// Circles are cool!
class Circle {
    constructor(
        public radius: number,
        public pos: Vector,
        public vel: Vector = new Vector(0, 0),
        public phys: Physics = new Physics(
            new Force(Math.PI * radius, new Vector(0, 0)),
            new Momentum(Math.PI * radius, new Vector(0, 0))),
        public color: string = 'Black',
        public bandColor: string = 'Black',
        public direction: number = 0,
        public speed: number = 2.0,
        public acc_value: number = 200.0,
        public turnRate: number = 0.1,
        public state: State = new State(),

        private lastPosition = new Vector(-1, -1) // this is set in detectSitting()
    ) {
    }
    public detectSitting(): void {
        if (Vector.dist(this.pos, this.lastPosition) <= .1) {
            State.sittingOn(this.state);
        } else {
            State.sittingOff(this.state);
        }
        this.lastPosition = this.pos;
    }
    public move(new_x: number, new_y: number): void {
        this.pos = new Vector(new_x, new_y)
    }
    public moveForwardByVel(): void {
        this.pos = new Vector(
            this.pos.x + this.speed * this.vel.x,
            this.pos.y + this.speed * this.vel.y);
    }
    public moveForwardByVec(vec: Vector): void {
        this.pos = Vector.plus(this.pos, vec);
    }
    private adjustVelocityToDirection(): void {
        this.setVel(new Vector(Math.sin(this.direction), Math.cos(this.direction)));
    }
    public turn(delta): void {
        /* a positive value indicates turning clockwise,  */
        this.direction = Math.abs(this.direction + delta) >= 2 * Math.PI ?
            (this.direction + delta) % Math.PI : this.direction + delta;
        this.adjustVelocityToDirection();
    }
    public turnToPosition(pos: Vector): void {
        if (Math.abs(Vector.angleBetween(this.vel, Vector.minus(pos, this.pos))) > 0.07) { // 0.07 could maybe be abstracted
            this.turn(this.turnRate * Vector.directionTo(this.vel, Vector.minus(pos, this.pos)));
        }
    }
    public setSpeed(spd: number): void {
        this.speed = spd;
    }
    public setVel(vel: Vector): void {
        this.vel = new Vector(vel.x, vel.y);
    }
    public addVel(vel: Vector): void {
        this.vel = new Vector(this.vel.x + vel.x, this.vel.y + vel.y);
    }
    public moveToPosition(pos: Vector): void {
        if (Vector.dist(this.pos, pos) > this.radius / 10) {
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
        this.phys.force.vect = new Vector(0, 0);
    }
    public lateralForceLeft(): void {
        this.phys.force.vect.x = this.acc_value * this.vel.y;
        this.phys.force.vect.y = this.acc_value * -this.vel.x;
    }

    public lateralForceRight(): void {
        this.phys.force.vect.x = this.acc_value * this.vel.y;
        this.phys.force.vect.y = this.acc_value * -this.vel.x;
    }
    // A lateral movement increases the overall speed of the circle, but it
    // doesn't decrease the time it will take to get to the target. That's so
    // fucking interesting!
    static lateralMoveRight(c: Circle): void {
        c.pos = new Vector(
            c.pos.x - c.vel.y,
            c.pos.y + c.vel.x);
    }
    static lateralMoveLeft(c: Circle): void {
        c.pos = new Vector(
            c.pos.x + c.vel.y,
            c.pos.y - c.vel.x);
    }
    static lateralForceLeft(c: Circle): void {
        c.phys.force.vect.x = c.vel.y;
        c.phys.force.vect.y = -c.vel.x;
    }
    static lateralForceRight(c: Circle): void {
        c.phys.force.vect.x = -c.vel.y;
        c.phys.force.vect.y = c.vel.x;
    }
    public moveMomentumVector() {
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
    // These static methods need to be in Circle, and not Vector, because they
    // need access to Circle.radius and other attributes.
    static isColliding(c1: Circle, c2: Circle): boolean {
        return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
    }
    static applyForce(c1: Circle, c2: Circle): void {
        if (this.isColliding(c1, c2)) {
            var diff = Vector.dist(c1.pos, c2.pos) - c1.radius - c2.radius;
            var dirTo = Vector.minus(c1.pos, c2.pos);
            c1.phys.force.vect = Vector.times(-diff, dirTo);
            c2.phys.force.vect = Vector.times(diff, dirTo);
        }
    }
    public impulse(): void {
        this.phys.momen.vect = Vector.plus(this.phys.momen.vect, this.phys.force.vect)
    }
    public moveByMomentum(): void {
        this.moveForwardByVec(
            Vector.times(1 / this.phys.momen.mass, this.phys.momen.vect));
    }
    public frictionMomentum(coeff: number): void {
        /* coeff should be in (0,1) that's non-inclusive */
        this.phys.momen.vect = Vector.times(coeff, this.phys.momen.vect);
    }
}

class State {
    constructor() { }
    public movement = true;
    public turn = true;
    public colliding = false;
    public cqc = false;
    public sitting = true;

    static sittingOn(st: State) {
        st.sitting = true
    }
    static sittingOff(st: State) {
        st.sitting = false
    }
}

/* FORCE AND MOMENTUM
 *   I need force and momentum so I can do the physical interactions between the
 * circles. */

class Force {
    constructor(
        public mass: number,
        public vect: Vector) { }
}

class Momentum {
    constructor(
        public mass: number,
        public vect: Vector) { }
    public vector(): Vector {
        return new Vector(
            this.mass * this.vect.x,
            this.mass * this.vect.y);
    }
}

class Physics {
    constructor(
        public force: Force,
        public momen: Momentum) { }
}

/* TIMED ACTION */

class UnitEvent {
    constructor(
        public circle: Circle,
        public affect: string,
        public count: number,
        public lastTrigger?: number) {
    }
    public decrement() {
        this.count -= 1;
    }
}

class SideStep extends UnitEvent {
    constructor(
        public circle: Circle,
        public stepping: number = 3,
        public direction: string = 'left') {
        super(circle, 'sideStep', 30)
    }
    public decrementStepping() {
        this.stepping -= 1;
    }
    public onZero(): void {
        this.decrementStepping();
        if (this.stepping > 0) {
            if (this.direction === 'left') {
                this.circle.lateralForceRight();
            } else if (this.direction === 'right') {
                this.circle.lateralForceLeft();
            }
            if (!this.circle.state.sitting) {
                if (this.direction === 'left') {
                    this.direction = 'right';
                } else {
                    this.direction = 'left';
                }
                this.count = 30;
                return
            }
            this.circle.impulse();
            this.circle.moveByMomentum();
        } else if (this.direction === 'left') {
            this.stepping = 3;
            this.direction = 'right';
        } else {
            this.direction = 'left';
            this.count = 30;
        }
    }
}

class twitch extends UnitEvent {
}
