define(["require", "exports", "./circle", "./vector", "./life", "./bullet", "./graph", "./life"], function (require, exports, circle_1, vector_1, life_1, bullet_1, graph_1, life_2) {
    "use strict";
    var AttackBehavior = (function () {
        function AttackBehavior() {
            var _this = this;
            this.attackRange = 50;
            this.lungeVelocity = 3;
            this.reinitialize = function () {
                _this.bAttack = new life_2.BasicAttack(2);
            };
            this.condition = function (v, game) {
                return _this.bAttack.canAttack(game);
            };
            this.consequence = function (attackV, game) {
                _this.targetEdge = attackV.edges.filter(graph_1.Graph.isDirty).filter(graph_1.Graph.isEdgeChildAlive)[0];
                if (_this.targetEdge === undefined) {
                    return;
                }
                if (Math.abs(attackV.circle.angleToCircle(_this.targetEdge.child.circle)) < .1 &&
                    _this.targetEdge.dist < _this.attackRange) {
                    _this.lungeAndAttack(attackV.circle, game);
                }
                else {
                    attackV.circle.moveToPosition(_this.targetEdge.child.circle.pos, game.graph);
                }
            };
            this.lungeAndAttack = function (attackC, game) {
                attackC.moveForwardByScalarVel(_this.lungeVelocity, game.graph);
                if (circle_1.Circle.isClipping(attackC, _this.targetEdge.child.circle)) {
                    _this.bAttack.attack(_this.targetEdge.child.circle, game);
                }
            };
            this.bAttack = new life_2.BasicAttack(2);
        }
        return AttackBehavior;
    }());
    exports.AttackBehavior = AttackBehavior;
    var WanderCloselyBehavior = (function () {
        function WanderCloselyBehavior(pos) {
            var _this = this;
            this.shouldWander = 30;
            this.wanderRadius = 7;
            this.reinitialize = function (pos) {
                _this.positionToMove = pos;
                _this.wanderPosition = pos;
            };
            this.consequence = function (v, game) {
                if (_this.outOfBoundCheck(v, game))
                    v.circle.moveToPosition(new vector_1.Vector(320, 320), game.graph);
                if (_this.shouldRunToGroup)
                    _this.runToGroup(v, game.graph);
                else if (_this.shouldWander >= 0) {
                    _this.wander(v, game.graph);
                    _this.shouldWander--;
                }
            };
            this.positionToMove = pos;
            this.wanderPosition = pos;
        }
        WanderCloselyBehavior.prototype.outOfBoundCheck = function (v, game) {
            if (this.positionToMove.x < 4 * v.circle.radius ||
                this.positionToMove.x > game.canvas.width - 4 * v.circle.radius ||
                this.positionToMove.y < 4 * v.circle.radius ||
                this.positionToMove.y > game.canvas.height - 4 * v.circle.radius) {
                return true;
            }
            else
                return false;
        };
        WanderCloselyBehavior.prototype.condition = function (v, game) {
            this.positionToMove = graph_1.Graph.mean(game.graph.closestCleanVertexes(v, 3));
            if (vector_1.Vector.distance(this.positionToMove, v.circle.pos) >
                this.wanderRadius * v.circle.radius) {
                this.shouldRunToGroup = true;
            }
            else {
                this.shouldRunToGroup = false;
                if (this.shouldWander < 0) {
                    this.willWander(v.circle, game.frame);
                }
            }
            return true;
        };
        WanderCloselyBehavior.prototype.runToGroup = function (v, graph) {
            v.circle.moveToPosition(this.positionToMove, graph);
        };
        WanderCloselyBehavior.prototype.wander = function (v, graph) {
            v.circle.moveToPosition(this.wanderPosition, graph);
        };
        WanderCloselyBehavior.prototype.willWander = function (c, frame) {
            if (frame % 300 === 0 && Math.random() < 0.30) {
                this.shouldWander = WanderCloselyBehavior.shouldWanderCount;
                this.wanderPosition =
                    vector_1.Vector.plus(this.positionToMove, vector_1.Vector.times(3 * this.wanderRadius * Math.random() * c.radius, vector_1.Vector.random()));
            }
        };
        return WanderCloselyBehavior;
    }());
    WanderCloselyBehavior.shouldWanderCount = 0;
    exports.WanderCloselyBehavior = WanderCloselyBehavior;
    var circleBehavior = (function () {
        function circleBehavior(v, game) {
            this.reinitialize = function () { };
        }
        circleBehavior.prototype.condition = function (v, game) {
            return true;
        };
        circleBehavior.prototype.consequence = function () {
            return;
        };
        return circleBehavior;
    }());
    exports.circleBehavior = circleBehavior;
    var SimpleAimShootBehavior = (function () {
        function SimpleAimShootBehavior() {
            var _this = this;
            this.attackRange = 440;
            this.reinitialize = function () { _this.bShoot = new life_1.BasicShoot(3); };
            this.condition = function (v, game) {
                var edge = v.edges.filter(graph_1.Graph.isDirty).filter(graph_1.Graph.isEdgeChildAlive)[0];
                if (edge === undefined) {
                    return false;
                }
                if (_this.bShoot.canAttack(game) && edge.dist < _this.attackRange) {
                    _this.targetV = edge.child;
                    return true;
                }
                return false;
            };
            this.consequence = function (v, game) {
                if (Math.abs(v.circle.angleToCircle(_this.targetV.circle)) < .1) {
                    _this.shootBullet(v, game);
                    _this.bShoot.resetAttack(game);
                }
                else
                    v.circle.turnToPosition(_this.targetV.circle.pos);
            };
            this.shootBullet = function (v, game) {
                var dirTo = v.circle.vel;
                bullet_1.Bullet.shoot(v.circle.pos, vector_1.Vector.times(1 / vector_1.Vector.mag(dirTo), dirTo), v.circle.teamColor, _this.bShoot.damage, game.graph);
            };
            this.bShoot = new life_1.BasicShoot(3);
        }
        return SimpleAimShootBehavior;
    }());
    exports.SimpleAimShootBehavior = SimpleAimShootBehavior;
    var chargeOpponentBehavior = (function () {
        function chargeOpponentBehavior() {
            this.reinitialize = function () { };
        }
        chargeOpponentBehavior.prototype.condition = function (v, game) {
            return true;
        };
        chargeOpponentBehavior.prototype.consequence = function (v, game) {
            return;
        };
        return chargeOpponentBehavior;
    }());
    exports.chargeOpponentBehavior = chargeOpponentBehavior;
});
//# sourceMappingURL=behavior.js.map