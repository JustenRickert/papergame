// -*- mode:typescript -*-
/* Attack the closest target to the circle given that the attackRate allows it.
 * The consequence is a sort of lunging attack that throws the attacking circle
 * (attackC: Circle) at the defending circle (defendC/targetC: Circle). */
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
                if (!_this.targetC)
                    return false;
                return true;
            }
            return false;
        };
        this.consequence = function (attackC) {
            // Is the attacking circle close to the defending circle?
            if (Vector.dist(attackC.pos, _this.targetC.pos) > _this.attackRange * attackC.radius)
                attackC.moveToPosition(_this.targetC.pos);
            else if (Math.abs(attackC.angleToCircle(_this.targetC)) < .1) {
                _this.lungeAndAttack(attackC);
            }
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
/* I want this behavior to be the default behavior for circles. Tells the circle
 * to wander if the circle is within the wander Radius (wanderRadius) of the
 * moment (the "vector mean" if the mean is the average of a set of values) of
 * the closest five, friendly circles. */
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
/* TODO: Move around the nearest, friendly circle clockwise, switching
 * directions periodically. There could maybe be a damage consequence upon
 * clipping an enemy circle. */
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
