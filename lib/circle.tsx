// -*-mode:typescript-*-

// Circles are cool!
class Circle {
    public clippingForce: number = 0.075;
    public life: Life = new Life(-1);
    public alive: boolean;
    public timeAlive: number;
    public behaviors: Behavior[]; // add behaviors to this array
    public wander: Behavior = new WanderCloselyBehavior(); // Default behavior
    constructor(
        public id: number,
        public radius: number,
        public pos: Vector,
        public dPos: Vector = new Vector(0, 0),
        public vel: Vector = Vector.random(),
        public color: string = 'Black',
        public bandColor: string = 'Black',
        public direction: number = 4 * Math.PI * Math.random() - 2 * Math.PI,
        public speed: number = 2.5,
        public turnRate: number = 0.07
    ) {
        this.alive = true;
        // if (!this.direction)
        // this.vel = Vector.random();
        // this.direction = 4 * Math.PI * Math.random() - 2 * Math.PI;
    }
    public position = (new_x: number, new_y: number): void => {
        this.pos = new Vector(new_x, new_y)
    }
    public moveForwardByVel = (): void => {
        this.pos = new Vector(
            this.pos.x + this.speed * this.vel.x,
            this.pos.y + this.speed * this.vel.y);
    }
    public moveForwardByScalarVel = (scalar: number): void => {
        this.pos = new Vector(
            this.pos.x + this.speed * scalar * this.vel.x,
            this.pos.y + this.speed * scalar * this.vel.y);
    }

    public moveForwardByVec = (vec: Vector): void => {
        this.pos = Vector.plus(this.pos, vec);
    }
    private adjustVelocityToDirection = (): void => {
        this.setVel(new Vector(Math.sin(this.direction), Math.cos(this.direction)));
    }
    public turn = (delta): void => {
        /* a positive value indicates turning clockwise,  */
        this.direction = Math.abs(this.direction + delta) >= 2 * Math.PI ?
            (this.direction + delta) % Math.PI : this.direction + delta;
        this.adjustVelocityToDirection();
    }
    public turnToPosition = (pos: Vector): void => {
        if (Math.abs(Vector.angleBetween(this.vel, Vector.minus(pos, this.pos))) > 0.01) {
            this.turn(this.turnRate * Vector.directionTo(this.vel, Vector.minus(pos, this.pos)));
        }
    }
    public setSpeed = (spd: number): void => {
        this.speed = spd;
    }
    public setVel = (vel: Vector): void => {
        this.vel = new Vector(vel.x, vel.y);
    }
    public addVel = (vel: Vector): void => {
        this.vel = new Vector(this.vel.x + vel.x, this.vel.y + vel.y);
    }
    public moveToPosition = (pos: Vector): void => {
        this.turnToPosition(pos);
        if (this.angleToPosition(pos)) {
            if (Vector.dist(this.pos, pos) > .1 * this.radius) {
                this.moveForwardByVel();
            }
        }
    }
    // This function, as well as `angleToPosition' may seem kind of strange. It
    // is the angle between the direction of movement of this circle to the
    // direction that this circle would face if it were pointing at the other
    // circle.
    public angleToCircle = (otherC: Circle): number => {
        return Vector.angleBetween(this.vel, Vector.minus(otherC.pos, this.pos))
    }
    public angleToPosition = (v: Vector): number => {
        return Vector.angleBetween(this.vel, Vector.minus(v, this.pos))
    }
    // Just a note, perhaps, that it is more efficient to use the built-in
    // function drawImage instead of drawing the circles and filling them in at
    // every frame. However, this is sort of the least of my concerns , because
    // in the future static images may be used instead, and also the game has a
    // ridiculous amount of overhead at this point (2016-12-21, 835 lines of
    // code).
    public draw = (): void => {
        if (!this.alive)
            this.color = 'gray'
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
        ctx.moveTo(
            this.pos.x + (3 * this.radius / 4) * Math.sin(this.direction),
            this.pos.y + (3 * this.radius / 4) * Math.cos(this.direction));
        // point to the left (or right, I dunno and it doesn't matter)
        ctx.lineTo(
            this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction + Math.PI / 3),
            this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction + Math.PI / 3));
        ctx.lineTo(
            this.pos.x + (2 * this.radius / 4) * Math.sin(this.direction - Math.PI / 3),
            this.pos.y + (2 * this.radius / 4) * Math.cos(this.direction - Math.PI / 3));
        // color it in
        ctx.fillStyle = this.bandColor;
        ctx.fill();
        ctx.closePath();
    }

    public isDead = (): boolean => this.life.health === 0;
    public static isDead = (c: Circle): boolean => c.life.health === 0;
    public static isAlive = (c: Circle): boolean => c.life.health !== 0;
    public markDead = (): void => {
        this.alive = false;
    }

    public static isThenClipping = (c1: Circle, c2: Circle): void => {
        if (Circle.isClipping(c1, c2)) {
            Circle.clippingPush(c1, c2);
        }
    }
    public static clippingPush = (c1: Circle, c2: Circle): void => {
        let dirTo = Vector.minus(c1.pos, c2.pos);
        let c1Force = dirTo;
        let c2Force = Vector.times(-1, dirTo);
        // if (dist < (c1.radius + c2.radius) / 2) {
        //     c1.moveForwardByVec(Vector.times(15 * c1.clippingForce, c1Force));
        //     c2.moveForwardByVec(Vector.times(15 * c2.clippingForce, c2Force));
        // }
        c1.moveForwardByVec(Vector.times(c1.clippingForce, c1Force));
        c2.moveForwardByVec(Vector.times(c2.clippingForce, c2Force));
    }
    // determines whether the circles are drawing themselves over one another.
    static isClipping = (c1: Circle, c2: Circle): boolean => {
        return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
    }
    public behave(v: Vertex, graph: Graph): void {
        // for (let bhvr of this.behaviors) {
        //     if (bhvr.condition(c, graph)) {
        //         bhvr.consequence(c);
        //         return
        //     }
        // }
        if (this.wander.condition(v, graph)) {
            this.wander.consequence(v);
            return
        }
    }
}

