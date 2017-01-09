var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// -*- mode:typescript -*-
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
Vector.equalPosition = function (p1, p2) { return p1.x === p2.x && p1.y === p2.y; };
/*-*-mode:typescript-*-*/
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var LASTCLICK = Vector.random();
// How can I write this one with the fat arrow?
canvas.onclick = function updateLastClick(event) {
    var mPos = getMousePos(canvas, event);
    LASTCLICK = new Vector(mPos.x, mPos.y);
};
var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};
// -*- mode:typescript -*-
var Life = (function () {
    function Life(maxHealth) {
        var _this = this;
        this.damage = function (d) {
            if (_this.health - d < 0)
                _this.health = 0;
            else
                _this.health -= d;
        };
        this.heal = function (h) {
            if (_this.health + h < _this.maxHealth)
                _this.health += h;
            else
                _this.health = _this.maxHealth;
        };
        this.maxHealth = maxHealth;
    }
    return Life;
}());
var BasicAttack = (function () {
    function BasicAttack(d) {
        this.attackRate = 90;
        this.damage = d;
        this.lastAttack = 0;
    }
    return BasicAttack;
}());
var Effect = (function () {
    function Effect() {
    }
    return Effect;
}());
// -*-mode:typescript-*-
var Game = (function () {
    function Game(redCount, blueCount) {
        var _this = this;
        this.won = false;
        this.lost = false;
        // public redBlueIsThenClipping = (): void => {
        //     for (let r of this.red.all) { // r for red
        //         for (let b of this.blue.all) { // b for blue
        //             Circle.isThenClipping(r, b);
        //         }
        //     }
        // }
        this.increment = function () { _this.frame++; };
        this.run = function () {
            _this.increment();
            // this.red.increment();
            // this.blue.increment();
            // this.behave();
        };
        this.draw = function () {
            // this.red.draw();
            // this.blue.draw();
        };
        this.spawnRed = function () {
            // spawns red dudes and then tells them what to do.
            // this.red.positionAll();
        };
        // public spawnBlue = (): void => {
        // spawns red dudes and then tells them what to do.
        // this.blue.positionAll();
        // }
        this.markDead = function () {
            // for (let r of this.red.all) {
            //     if (r.isDead())
            //         r.markDead();
            // }
            // for (let b of this.blue.all) {
            //     if (b.isDead())
            //         b.markDead();
            // }
        };
        this.losing = function () { _this.lost = true; };
        this.winning = function () { _this.won = true; };
        this.gameCount = redCount + blueCount;
        // this.red = new Reds(redCount, this.gameCount);
        // this.blue = new Blues(blueCount, this.gameCount);
        this.frame = 0;
    }
    // public checkWinLose = (): void => {
    //     if (this.red.all.every(Circle.isDead))
    //         this.losing();
    //     else if (this.blue.all.every(Circle.isDead))
    //         this.winning();
    // }
    // public collision = (): void => {
    //     // this.red.isThenClipping();
    //     // this.blue.isThenClipping();
    //     // this.redBlueIsThenClipping();
    // }
    Game.prototype.updateDistanceTable = function () {
        // this.distanceRed = this.red.distanceTable();
        // this.distanceBlue = this.blue.distanceTable();
    };
    return Game;
}());
// public closestCircle = (c: Circle, color?: string): Circle => {
// if (color) {
//     var group: Circle[] = {
//         'Red': this.red.all,
//         'Blue': this.blue.all
//     }[color]
// }
// var minC: Circle;
// var dist: number;
// for (let otherC of group) {
//     if (c !== otherC) {
//         if (!minC && otherC.alive)
//             minC = otherC
//         dist = Vector.dist(c.pos, otherC.pos);
//     } else dist = Infinity
//     if (otherC.alive && dist && Vector.dist(c.pos, minC.pos) > dist)
//         minC = otherC;
// }
// return minC;
// }
// public bottomFiveDistance = (c: Circle, color: string): any[] => {
//     var distance = {
//         'Red': this.distanceRed[c.id],
//         // 'Blue': this.distanceBlue[c.id]
//     }[color];
//     let id = [];
//     if (distance.length <= 5) {
//         for (let j in distance) {
//             id.push(j);
//         }
//         return zip(id, distance);
//     }
//     let dist = [];
//     for (let j = 0; j < 5; j++) {
//         id.push(j)
//         dist.push(distance[j]);
//     }
//     let smallest: number = dist.indexOf(min(dist));
//     for (let j = 5; j < distance.length; j++) {
//         if (distance[j] > dist[smallest]) {
//             dist[smallest] = distance[j];
//             id[smallest] = j;
//             smallest = dist.indexOf(min(dist));
//         }
//     }
//     return zip(id, dist);
// }
/* Returns the center of mass of closest five circles to the circle
 * argument. */
// public momentClosestFive = (c: Circle, color: string): Vector => {
//     let clstFivePos: Vector[] = [];
//     let botmFive: any[] = this.bottomFiveDistance(c, color);
//     for (let e of botmFive) {
//         var all = {
//             'Red': this.red.all,
//             // 'Blue': this.blue.all
//         }[color];
//         clstFivePos.push(all[e[0]].pos);
//     }
//     return Game.moment(clstFivePos);
// }
// public behave = (): void => {
//     for (let r of this.red.all) {
//         if (r.alive)
//             r.behave(r, this);
//     }
//     for (let b of this.blue.all) {
//         if (b.alive)
//             b.behave(b, this);
//     }
// }
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
// -*-mode:typescript-*-
// Circles are cool!
var Circle = (function () {
    function Circle(id, radius, pos, dPos, vel, color, bandColor, direction, speed, turnRate) {
        if (dPos === void 0) { dPos = new Vector(0, 0); }
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
        this.dPos = dPos;
        this.vel = vel;
        this.color = color;
        this.bandColor = bandColor;
        this.direction = direction;
        this.speed = speed;
        this.turnRate = turnRate;
        this.clippingForce = 0.075;
        this.life = new Life(-1);
        this.wander = new WanderCloselyBehavior(); // Default behavior
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
        this.moveToPosition = function (pos, graph) {
            _this.turnToPosition(pos);
            if (_this.angleToPosition(pos)) {
                if (Vector.dist(_this.pos, pos) > .1 * _this.radius) {
                    graph.addDelta(graph.indexOfCircle(_this), new Vector(_this.speed * _this.vel.x, _this.speed * _this.vel.y));
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
        this.isDead = function () { return _this.life.health === 0; };
        this.markDead = function () {
            _this.alive = false;
        };
        this.alive = true;
        // if (!this.direction)
        // this.vel = Vector.random();
        // this.direction = 4 * Math.PI * Math.random() - 2 * Math.PI;
    }
    Circle.prototype.behave = function (v, graph) {
        // for (let bhvr of this.behaviors) {
        //     if (bhvr.condition(c, graph)) {
        //         bhvr.consequence(c);
        //         return
        //     }
        // }
        if (this.wander.condition(v, graph)) {
            this.wander.consequence(v, graph);
            return;
        }
    };
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
    var dirTo = Vector.minus(c1.pos, c2.pos);
    var c1Force = dirTo;
    var c2Force = Vector.times(-1, dirTo);
    // if (dist < (c1.radius + c2.radius) / 2) {
    //     c1.moveForwardByVec(Vector.times(15 * c1.clippingForce, c1Force));
    //     c2.moveForwardByVec(Vector.times(15 * c2.clippingForce, c2Force));
    // }
    c1.moveForwardByVec(Vector.times(c1.clippingForce, c1Force));
    c2.moveForwardByVec(Vector.times(c2.clippingForce, c2Force));
};
// determines whether the circles are drawing themselves over one another.
Circle.isClipping = function (c1, c2) {
    return Vector.dist(c1.pos, c2.pos) < c1.radius + c2.radius;
};
// -*- mode:typescript -*-
/* These are to be the place to have all of the red circles and things */
/* RedCircle is going to be the base class for all friendly circles. The default
 * behavior of red circles will be to wander closely to the nearest five
 * friendly units. Otherwise, this circle is just fucking bag of meat awaiting
 * death. */
var RedCircle = (function (_super) {
    __extends(RedCircle, _super);
    function RedCircle(id) {
        var behaviors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behaviors[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, id, 20, new Vector(200, 300)) || this;
        _this.behaviors = behaviors;
        _this.id = id;
        _this.color = "Red";
        _this.timeAlive = 0;
        _this.life.maxHealth = 10;
        _this.life.health = _this.life.maxHealth;
        return _this;
    }
    RedCircle.prototype.increment = function () {
        this.timeAlive++;
    };
    return RedCircle;
}(Circle));
// class Reds {
//     // I'm sure there's really no need to have the count variable... but it's
//     // just one little number so idc.
//     public count: number;
//     public all: RedCircle[];
//     constructor(count: number, gameCount: number) {
//         this.count = count;
//         this.all = [];
//         for (var i = 0; i < count; i++) {
//             this.all.push(new RedCircle(i, new AttackBehavior()));
//         }
//         gameCount += count
//     }
//     public increment = (): void => {
//         for (let rc of this.all)
//             rc.timeAlive++
//     }
//     public positionAll = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].position(15, 15);
//         }
//     }
//     public draw = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].draw();
//         }
//     }
//     public moveToPosition = (v: Vector): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].moveToPosition(v);
//         }
//     }
//     public isThenClipping = (): void => {
//         for (let r of this.all) { // r for red
//             for (let or of this.all) { // or for other red
//                 if (r !== or) {
//                     Circle.isThenClipping(or, r);
//                 }
//             }
//         }
//     }
//     public distanceTable = (): number[][] => {
//         var table: any[] = [];
//         for (let i = 0; i < this.count; i++) {
//             table[i] = []
//             for (let j = 0; j < this.count; j++) {
//                 table.push(Infinity);
//             }
//         }
//         for (let i = 0; i < this.count; i++) {
//             for (let j = 0; j < this.count; j++) {
//                 if (i !== j) {
//                     table[i][j] = Vector.dist(this.all[i].pos, this.all[j].pos);
//                 }
//             }
//         }
//         return table;
//     }
// }
// -*- mode:typescript -*-
// class BlueCircle extends Circle {
//     public timeAlive: number;
//     public behaviors: Behavior[];
//     public wander: Behavior = new WanderCloselyBehavior(); // Default behavior
//     constructor(id: number, ...behaviors: Behavior[]) {
//         super(id, 20, new Vector(200, 300))
//         this.behaviors = behaviors;
//         this.id = id;
//         this.color = "Blue";
//         this.timeAlive = 0
//         this.life.maxHealth = 10;
//         this.life.health = this.life.maxHealth;
//     }
//     public increment = (): void => {
//         this.timeAlive++
//     }
//     public behave = (c: Circle, g: Game): void => {
//         for (let bhvr of this.behaviors) {
//             if (bhvr.condition(c, g)) {
//                 bhvr.consequence(c);
//                 return
//             }
//         }
//         this.wander.condition(c, g);
//         this.wander.consequence(c);
//     }
// }
// class Blues {
//     // I'm sure there's really no need to have the count variable... but it's
//     // just one little number so idc.
//     public count: number;
//     public all: BlueCircle[];
//     constructor(count: number, gameCount: number) {
//         this.count = count;
//         this.all = [];
//         for (var i = 0; i < count; i++) {
//             this.all.push(new BlueCircle(i, new AttackBehavior()));
//         }
//         gameCount += count
//     }
//     public increment = (): void => {
//         for (let rc of this.all)
//             rc.timeAlive++
//     }
//     public positionAll = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].position(canvas.width-15, canvas.height-15);
//         }
//     }
//     public draw = (): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].draw();
//         }
//     }
//     public moveToPosition = (v: Vector): void => {
//         for (var i = 0; i < this.count; i++) {
//             this.all[i].moveToPosition(v);
//         }
//     }
//     public isThenClipping = (): void => {
//         for (let b of this.all) {
//             for (let or of this.all) {
//                 if (b !== or) {
//                     Circle.isThenClipping(or, b);
//                 }
//             }
//         }
//     }
//     public distanceTable = (): number[][] => {
//         var table: number[][] = [];
//         for (let i = 0; i < this.count; i++) {
//             table[i] = []
//             for (let j = 0; j < this.count; j++) {
//                 table[i].push(Infinity);
//             }
//         }
//         for (let i = 0; i < this.count; i++) {
//             for (let j = 0; j < this.count; j++) {
//                 if (i !== j) {
//                     table[i][j] = Vector.dist(this.all[i].pos, this.all[j].pos);
//                 }
//             }
//         }
//         return table;
//     }
// }
// -*- mode:typescript -*-
/* Attack the closest target to the circle given that the attackRate allows it.
 * The consequence is a sort of lunging attack that throws the attacking circle
 * (attackC: Circle) at the defending circle (defendC/targetC: Circle). */
var AttackBehavior = (function () {
    function AttackBehavior() {
        this.bAttack = new BasicAttack(1);
        this.attackRange = 3;
        this.lungeVelocity = 3;
        this.condition = function (v, graph) {
            // if (this.bAttack.canAttack()) {
            //     let opposingColor: string = {
            //         'Red': 'Blue',
            //         'Blue': 'Red'
            //     }[v.circle.color]
            //     this.targetV = graph.closestDirtyVertex(v);
            //     if (!this.targetV)
            //         return false
            //     return true;
            // }
            return false;
        };
        this.consequence = function (attackV, graph) {
            // // Is the attacking circle close to the defending circle?
            // if (Vector.dist(attackV.circle.pos, this.targetV.circle.pos) >
            //     this.attackRange * attackV.circle.radius)
            //     attackV.circle.moveToPosition(this.targetV.circle.pos, graph);
            // // Is the angle right to lunge at the enemy?
            // else if (Math.abs(attackV.circle.angleToCircle(this.targetV.circle)) < .1) {
            //     this.lungeAndAttack(attackV.circle);
            // }
            // // Turn to the defending circle so the previous predicate is true.
            // else
            //     attackV.circle.turnToPosition(this.targetV.circle.pos);
        };
        this.lungeAndAttack = function (attackC) {
            // attackC.moveForwardByScalarVel(this.lungeVelocity);
            // if (Circle.isClipping(attackC, this.targetV.circle)) {
            //     this.bAttack.attack(this.targetV.circle);
            // }
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
    WanderCloselyBehavior.prototype.outOfBoundCheck = function (v) {
        if (this.positionToMove.x < 4 * v.circle.radius ||
            this.positionToMove.x > canvas.width - 4 * v.circle.radius ||
            this.positionToMove.y < 4 * v.circle.radius ||
            this.positionToMove.y > canvas.height - 4 * v.circle.radius) {
            return true;
        }
        else
            return false;
    };
    // Timed constraint. If constrained, then just stay put, maybe make him
    // randomly turn distances.
    WanderCloselyBehavior.prototype.condition = function (v, graph) {
        // console.log(Graph.mean(graph.closestCleanVertexes(v, 3)));
        this.positionToMove = Graph.mean(graph.closestCleanVertexes(v, 3));
        // console.log(Vector.dist(this.positionToMove, v.circle.pos))
        if (Vector.dist(this.positionToMove, v.circle.pos) >
            this.wanderRadius * v.circle.radius) {
            this.shouldRunToGroup = true;
        }
        else {
            this.shouldRunToGroup = false;
            if (this.shouldWander < 0) {
                this.willWander(v.circle);
            }
        }
        return true;
    };
    // The circle is either far enough away to want to run towards the group, or
    // the circle wanders around aimlessly.
    WanderCloselyBehavior.prototype.consequence = function (v, graph) {
        if (this.outOfBoundCheck(v))
            v.circle.moveToPosition(new Vector(320, 320), graph);
        if (this.shouldRunToGroup)
            this.runToGroup(v, graph);
        else if (this.shouldWander >= 0) {
            this.wander(v, graph);
            this.shouldWander--;
        }
    };
    WanderCloselyBehavior.prototype.runToGroup = function (v, graph) {
        v.circle.moveToPosition(this.positionToMove, graph);
    };
    WanderCloselyBehavior.prototype.wander = function (v, graph) {
        v.circle.moveToPosition(this.wanderPosition, graph);
    };
    WanderCloselyBehavior.prototype.willWander = function (c) {
        if (Math.random() < 0.001) {
            this.shouldWander = WanderCloselyBehavior.shouldWanderCount;
            this.wanderPosition =
                Vector.plus(this.positionToMove, Vector.times(3 * this.wanderRadius * Math.random() * c.radius, Vector.random()));
        }
    };
    return WanderCloselyBehavior;
}());
WanderCloselyBehavior.shouldWanderCount = 60;
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
// -*-mode:typescript-*-
// Dirty edges and Clean edges
var Graph = (function () {
    function Graph(circles) {
        var _this = this;
        // I can't figure out how to do this with map... There might be performance
        // increases in using map instead of iterating over the array.
        //
        // Sums the delta with current position, then resets the delta.
        this.sumResetDelta = function () {
            // let i = 0; i < this.vertexes.length; i++
            var nilVector = new Vector(0, 0);
            for (var i in _this.vertexes) {
                _this.vertexes[i].circle.pos = Vector.plus(_this.vertexes[i].circle.pos, _this.vertexDeltas[i]);
                _this.vertexDeltas[i] = nilVector;
            }
            // calculate new edge distances
            _this.edges.forEach(function (edge) {
                return edge.distance = Vector.dist(edge.parent.circle.pos, edge.child.circle.pos)
                    - edge.parent.circle.radius - edge.child.circle.radius;
            });
        };
        this.isParentOfEdge = function (circle, edge) { return circle === edge.parent.circle; };
        this.getVertexes = function (circles) {
            var vertexes = [];
            for (var i in circles) {
                vertexes.push({
                    circle: circles[i], edges: _this.edgesWithCircle(circles[i])
                });
            }
            return vertexes;
        };
        this.addDelta = function (index, v) {
            _this.vertexDeltas[index] = Vector.plus(_this.vertexDeltas[index], v);
        };
        this.edgesWithCircle = function (c) {
            return _this.edges.filter(_this.isParentOfEdge.bind(_this, c));
        };
        // I am going to segregate the type of the edge by comparing the difference
        // of the circles. If the colors of the circles are the same, then they are
        // called dirty. If the colors of the circles are different, then they are
        // called clean.
        this.smallestCEdge = function (c1) { return _this.cEdges[0]; };
        this.smallestDEdge = function (c1) { return _this.dEdges[0]; };
        // collision
        this.isThenClipping = function () { return _this.edges.forEach(function (edge) {
            // console.log(edge.distance)
            if (edge.distance <= 0)
                _this.clippingPush(edge);
        }); };
        this.closestVertex = function (v) { return v.edges[0].child; };
        this.closestDirtyVertex = function (v) { return v.edges.filter(Graph.isDirty)[0].parent; };
        this.closestDirtyVertexes = function (v, n) {
            if (n > v.edges.length) {
                n = v.edges.length;
            }
            else if (n < 0) {
                n = 0;
            }
            return v.edges.filter(Graph.isDirty).slice(0, n).map(function (edge) { return edge.child; });
        };
        this.closestCleanVertex = function (v) { return v.edges.filter(Graph.isClean)[0].parent; };
        this.closestCleanVertexes = function (v, n) {
            if (n > v.edges.length) {
                n = v.edges.length;
            }
            else if (n < 0) {
                n = 0;
            }
            return v.edges.filter(Graph.isClean).slice(0, n).map(function (edge) { return edge.child; });
        };
        this.behaviorRun = function () { return _this.vertexes.forEach(function (v) { return v.circle.behave(v, _this); }); };
        // The thought process behind adding delta is that I'm going to reprocess
        // information in the vertexes loops anyways, so I'm missing a speed bonus
        // here slightly. Regardless, I want an immutable state, thus I am adding
        // deltas which will be processed at a different part of the game running
        // loop. That is, something like REPL (read eval print loop). I want there
        // to one consistent state which persists between the read, evaluate, and
        // print parts.
        this.clippingPush = function (edge) {
            var dirTo = Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
            var multiplier = (1 - edge.distance) / 32; // edge.distance should be negative if clipping
            // console.log(edge.distance);
            // console.log(Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo))
            _this.addDelta(_this.indexOf(edge.parent), Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
        };
        this.indexOf = function (vertex) {
            for (var i in _this.vertexes) {
                if (Vector.equalPosition(_this.vertexes[i].circle.pos, vertex.circle.pos)) {
                    return Number(i);
                }
            }
            return -1;
        };
        this.indexOfCircle = function (circle) {
            for (var i in _this.vertexes) {
                if (Vector.equalPosition(_this.vertexes[i].circle.pos, circle.pos))
                    return Number(i);
            }
            return -1;
        };
        // Just a note, perhaps, that it is more efficient to use the built-in
        // function drawImage instead of drawing the circles and filling them in at
        // every frame. However, this is sort of the least of my concerns , because
        // in the future static images may be used instead, and also the game has a
        // ridiculous amount of overhead at this point (2016-12-21, 835 lines of
        // code).
        this.drawVertexes = function () { return _this.vertexes.forEach(function (v) { return _this.drawCircle(v.circle); }); };
        this.drawCircle = function (circle) {
            if (!circle.alive)
                circle.color = 'gray';
            // Draw the Circle
            ctx.beginPath();
            ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
            ctx.closePath();
            // color in the circle
            ctx.fillStyle = circle.color;
            ctx.fill();
            // Draw the triangle at circle.direction at half radius. I think I'm going
            // to make all projectiles squares. Triangles could be designated as
            // structures.
            ctx.beginPath();
            // forward point
            ctx.moveTo(circle.pos.x + (3 * circle.radius / 4) * Math.sin(circle.direction), circle.pos.y + (3 * circle.radius / 4) * Math.cos(circle.direction));
            // point to the left (or right, I dunno and it doesn't matter)
            ctx.lineTo(circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction + Math.PI / 3), circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction + Math.PI / 3));
            ctx.lineTo(circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction - Math.PI / 3), circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction - Math.PI / 3));
            // color it in
            ctx.fillStyle = circle.bandColor;
            ctx.fill();
            ctx.closePath();
        };
        this.edges = Graph.sortedEdges(Graph.getEdges(circles));
        this.vertexes = this.getVertexes(circles);
        this.vertexDeltas = [];
        for (var i in this.vertexes) {
            this.vertexDeltas.push(new Vector(0, 0));
        }
        this.cEdges = this.edges.filter(Graph.isClean);
        this.dEdges = this.edges.filter(Graph.isDirty);
    }
    return Graph;
}());
Graph.getEdges = function (circles) {
    var edges = [];
    for (var _i = 0, circles_1 = circles; _i < circles_1.length; _i++) {
        var parent_1 = circles_1[_i];
        for (var _a = 0, circles_2 = circles; _a < circles_2.length; _a++) {
            var child = circles_2[_a];
            var edge = Graph.produceEdge({ circle: parent_1, edges: [] }, { circle: child, edges: [] });
            if (parent_1 !== child) {
                edges.push(edge);
            }
        }
    }
    for (var i in edges) {
        edges[i].distance =
            Vector.dist(edges[i].parent.circle.pos, edges[i].child.circle.pos)
                - edges[i].parent.circle.radius - edges[i].child.circle.radius;
    }
    return edges;
};
// This sorting algorithm is the built-in one. The JavaScript developers are
// probably really clever, so it's a strong bet this is pretty good to use.
// However, in the future it may be worth investigating some time into if
// that really is not the case! It would ideally operate close to an O(n)
// function. Probably the upper bound is O(n*log(n)).
Graph.sortedEdges = function (edges) { return edges.sort(Graph.compareDist); };
// I don't use this I think...
Graph.produceVertex = function (c) {
    return { circle: c, edges: [] };
};
Graph.produceEdge = function (v1, v2) {
    return {
        parent: v1,
        child: v2,
        distance: Vector.dist(v1.circle.pos, v2.circle.pos)
    };
};
Graph.compareDist = function (e1, e2) { return e1.distance - e2.distance; };
Graph.isDirty = function (e) { return e.parent.circle.color !== e.child.circle.color; };
Graph.isClean = function (e) { return e.parent.circle.color === e.child.circle.color; };
Graph.mean = function (vertexes) {
    // Reduces the vector list to the sum of the vertex positions, then
    // returns that value's division by the vector list's length, thus
    // returning the mean.
    return Vector.times(1 / vertexes.length, vertexes.reduce((function (accumVector, v) {
        return Vector.plus(accumVector, v.circle.pos);
    }), new Vector(0, 0)));
};
var Statistics = (function () {
    function Statistics() {
        this.moment = function (vertexes) {
            var totalVec = new Vector(0, 0);
            for (var _i = 0, vertexes_1 = vertexes; _i < vertexes_1.length; _i++) {
                var v = vertexes_1[_i];
                totalVec = Vector.plus(v.circle.pos, totalVec);
            }
            return Vector.times(1 / vertexes.length, totalVec);
        };
    }
    return Statistics;
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
 * defend other specific pieces, or attack unrelentingly---so that then the end
 * goal is one team winning over the other. */
// function start() {
//     game.frame++
//     game.updateDistanceTable();
//     // console.log(
//     //     game.bottomFiveDistance(game.red.all[0]),
//     //     game.momentClosestFive(game.red.all[0]))
//     clearScreen(); // TODO: There is better way to do this, clearing the screen
//     // is pretty intensive, apparently. Also, the circles and things don't need
//     // to be drawn every frame. They can just moved around, but that should be
//     // easy to do later.
//     game.collision();
//     game.run();
//     game.draw();
//     game.markDead();
//     game.checkWinLose();
//     if (game.won || game.lost)
//         return
//     requestAnimationFrame(start);
// }
// var game: Game = new Game(100, 100);
// game.spawnRed();
// game.spawnBlue();
// start();
// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
var TEST_CIRCLES = [];
for (var i = 0; i < 10; i++) {
    TEST_CIRCLES.push(new RedCircle(i));
    TEST_CIRCLES[i].position(12, 12);
}
var graph = new Graph(TEST_CIRCLES);
// console.log('THE OTHER FUCK')
testGameLoop();
// console.log('THE SECOND OTHER FUCK')
function testGameLoop() {
    // console.log('THE FUCK')
    graph.behaviorRun();
    graph.isThenClipping();
    clearScreen();
    graph.drawVertexes();
    graph.sumResetDelta();
    // return
    requestAnimationFrame(testGameLoop);
}