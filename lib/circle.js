// -*-mode:typescript-*-
// Circles are cool!
var Circle = (function () {
    function Circle(id, radius, pos, vel, color, bandColor, direction, speed, turnRate) {
        if (vel === void 0) { vel = Vector.random(); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 4 * Math.PI * Math.random() - 2 * Math.PI; }
        if (speed === void 0) { speed = 2.5; }
        if (turnRate === void 0) { turnRate = 0.07; }
        var _this = this;
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
            if (Math.abs(Vector.angleBetween(_this.vel, Vector.minus(pos, _this.pos))) > 0.01) {
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
            if (_this.angleToPosition(pos)) {
                if (Vector.dist(_this.pos, pos) > .1 * _this.radius) {
                    _this.moveForwardByVel();
                }
            }
        };
        // This function, as well as `angleToPosition' may seem kind of strange. It
        // is the angle between the direction of movement of this circle to the
        // direction that this circle would face if it were pointing at the other
        // circle.
        this.angleToCircle = function (otherC) {
            return Vector.angleBetween(_this.vel, Vector.minus(otherC.pos, _this.pos));
        };
        this.angleToPosition = function (v) {
            return Vector.angleBetween(_this.vel, Vector.minus(v, _this.pos));
        };
        // Just a note, perhaps, that it is more efficient to use the built-in
        // function drawImage instead of drawing the circles and filling them in at
        // every frame. However, this is sort of the least of my concerns , because
        // in the future static images may be used instead, and also the game has a
        // ridiculous amount of overhead at this point (2016-12-21, 835 lines of
        // code).
        this.draw = function () {
            if (!_this.alive)
                _this.color = 'gray';
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
        this.isDead = function () { return _this.life.health === 0; };
        this.markDead = function () {
            _this.alive = false;
        };
        this.alive = true;
        // if (!this.direction)
        // this.vel = Vector.random();
        // this.direction = 4 * Math.PI * Math.random() - 2 * Math.PI;
    }
    return Circle;
}());
Circle.isDead = function (c) { return c.life.health === 0; };
Circle.isAlive = function (c) { return c.life.health !== 0; };
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
// determines whether the circles are drawing themselves over one another.
Circle.isClipping = function (c1, c2) {
    return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
};
