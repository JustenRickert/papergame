var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Functions for the menu making that is to be done.
 */
function openCity(evt, cityName) {
    // Declare all variables
    var tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++)
        tabcontent[i].style.display = "none";
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++)
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    // Show the current tab, and add an "active" class to the link that opened
    // the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
function initCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
}
var Bullet = (function () {
    function Bullet(position, direction) {
        var _this = this;
        this.size = 2;
        this.behave = function (game) {
            // if (/* Colliding with closest vertex */) {
            // } else
            //     this.moveForward(game);
        };
        this.moveForward = function (game) {
            _this.pos = Vector.plus(_this.pos, _this.vel);
        };
        this.pos = position;
        this.vel = direction;
    }
    // Takes a position, and a direction, places a bullet on the graph at the
    // position, moving in some vector direction. The bullet is added to the
    // bullet array in graph, wherein graph handles its collision.
    Bullet.shoot = function (position, direction, graph) {
        graph.bullets.push(new Bullet(position, direction));
    };
    return Bullet;
}());
// -*-mode:typescript-*-
var Graph = (function () {
    function Graph(player) {
        var _this = this;
        this.vertexDeltas = [];
        this.gridIndexOf = function (vertex, line) {
            var x;
            var y;
            for (var i = 1; i <= line.x.length; i++) {
                if (vertex.circle.pos.x < line.x[i]) {
                    x = String(i - 1);
                    break;
                }
            }
            for (var i = 1; i <= line.y.length; i++) {
                if (vertex.circle.pos.y < line.y[i]) {
                    y = String(i - 1);
                    break;
                }
            }
            if (!x)
                x = String(line.x.length);
            if (!y)
                y = String(line.y.length);
            return { x: x, y: y };
        };
        // Sums the delta with current position, then resets the delta.
        this.sumResetDelta = function () {
            // let i = 0; i < this.vertexes.length; i++
            var nilVector = new Vector(0, 0);
            for (var i in _this.vertexes) {
                _this.vertexes[i].circle.pos = Vector.plus(_this.vertexes[i].circle.pos, _this.vertexDeltas[i]);
                _this.vertexDeltas[i] = nilVector;
            }
            // calculate new edge distances & sort
            for (var i in _this.edges) {
                _this.edges[i].dist =
                    Vector.distance(_this.edges[i].parent.circle.pos, _this.edges[i].child.circle.pos)
                        - _this.edges[i].parent.circle.radius
                        - _this.edges[i].child.circle.radius;
            }
            _this.edges = Graph.sortedEdges(_this.edges);
            // place new edges inside of vertexes
            for (var i in _this.vertexes) {
                _this.vertexes[i].edges = _this.edgesWithCircle(_this.vertexes[i].circle);
            }
        };
        this.updateCollisionBucket = function () { return _this.collisionBucket.recalculateBucket(_this); };
        this.isParentOfEdge = function (circle, edge) {
            return circle === edge.parent.circle;
        };
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
        // collision
        this.isThenClipping = function () {
            // So, this.edges is ordered, meaning when we stop finding colliding
            // edges, there won't be anymore colliding edges.
            for (var _i = 0, _a = _this.edges; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.dist <= 0)
                    _this.clippingPush(e);
                else
                    break;
            }
        };
        this.closestVertex = function (v) { return v.edges[0].child; };
        this.closestDirtyVertex = function (v) { return v.edges.filter(Graph.isDirty)[0].child; };
        this.closestDirtyVertexes = function (v, n) {
            if (n > v.edges.length) {
                n = v.edges.length;
            }
            else if (n < 0) {
                n = 0;
            }
            return v.edges.filter(Graph.isDirty).slice(0, n).map(function (edge) { return edge.child; });
        };
        this.closestCleanVertex = function (v) { return v.edges.filter(Graph.isClean)[0].child; };
        this.closestCleanVertexes = function (v, n) {
            if (n > v.edges.length) {
                n = v.edges.length;
            }
            else if (n < 0) {
                n = 0;
            }
            return v.edges.filter(Graph.isClean).slice(0, n).map(function (edge) { return edge.child; });
        };
        this.behaviorRun = function (game) { return _this.vertexes.forEach(function (v) { return v.circle.behave(v, game); }); };
        this.bulletRun = function (game) { return _this.bullets.forEach(function (b) { return b.behave(game); }); };
        this.clippingPush = function (edge) {
            var dirTo = Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
            // edge.distance should be negative if clipping
            var multiplier = (1 - edge.dist) / 25;
            _this.addDelta(_this.indexOf(edge.parent), Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
        };
        // I guess there's not a better way to do this. I would think that there
        // would be. But its O(n), or Omega(1), but whatever.
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
        this.drawTest = function (sideLength, position, direction) {
            return Shape.drawRect(position, direction);
        };
        var nilVector = new Vector(0, 0);
        this.player = player;
        this.edges = Graph.sortedEdges(Graph.getEdges(player.circles));
        this.vertexes = this.getVertexes(player.circles);
        for (var i in this.vertexes) {
            this.vertexDeltas[i] = nilVector;
        }
        this.size = { height: canvas.height, width: canvas.width };
        this.collisionBucket = new CollisionBucket(this);
    }
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
            edges[i].dist =
                Vector.distance(edges[i].parent.circle.pos, edges[i].child.circle.pos)
                    - edges[i].parent.circle.radius - edges[i].child.circle.radius;
        }
        return edges;
    };
    Graph.sortedEdges = function (edges) { return edges.sort(Graph.compareDist); };
    Graph.produceVertex = function (c) {
        return { circle: c, edges: [] };
    };
    Graph.produceEdge = function (v1, v2) {
        return {
            parent: v1,
            child: v2,
            dist: Vector.distance(v1.circle.pos, v2.circle.pos)
        };
    };
    Graph.compareDist = function (e1, e2) { return e1.dist - e2.dist; };
    Graph.isDirty = function (e) {
        return e.parent.circle.color !== e.child.circle.color;
    };
    Graph.isClean = function (e) {
        return e.parent.circle.color === e.child.circle.color;
    };
    Graph.mean = function (vertexes) {
        // Reduces the vector list to the sum of the vertex positions, then
        // returns that value's division by the vector list's length, thus
        // returning the mean.
        return Vector.times(1 / vertexes.length, vertexes.reduce((function (accumVector, v) {
            return Vector.plus(accumVector, v.circle.pos);
        }), new Vector(0, 0)));
    };
    return Graph;
}());
// -*- mode:typescript -*-
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    Vector.distance = function (v1, v2) {
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
    Vector.times = function (k, v) { return new Vector(k * v.x, k * v.y); };
    Vector.minus = function (v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y); };
    Vector.plus = function (v1, v2) { return new Vector(v1.x + v2.x, v1.y + v2.y); };
    Vector.dot = function (v1, v2) { return v1.x * v2.x + v1.y * v2.y; };
    Vector.mag = function (v) { return Math.sqrt(v.x * v.x + v.y * v.y); };
    Vector.equalPosition = function (p1, p2) { return p1.x === p2.x && p1.y === p2.y; };
    // https://en.wikipedia.org/wiki/Rotation_matrix/
    Vector.rotate = function (alpha, vector) {
        var ca = Math.cos(alpha);
        var sa = Math.sin(alpha);
        return new Vector(ca * vector.x - sa * vector.y, sa * vector.x + ca * vector.y);
    };
    return Vector;
}());
var Shape = (function () {
    function Shape() {
    }
    // I know what these next two are, but don't use them
    Shape.forwardPoint = function (size, position, direction) {
        return Vector.plus(position, Vector.times(size, direction));
    };
    Shape.backPoints = function (sideLength, forwardPoint, direction, alpha) {
        var inwardDirection = Vector.times(-1, direction);
        var left = Vector.plus(forwardPoint, Vector.times(sideLength, Vector.rotate(alpha, inwardDirection)));
        var right = Vector.plus(forwardPoint, Vector.times(sideLength, Vector.rotate(-alpha, inwardDirection))); // note the -alpha
        return { left: left, right: right };
    };
    Shape.drawRect = function (position, direction) {
        var forwardPoint = Shape.forwardPoint(2, position, direction);
        var frontLeft = Vector.plus(forwardPoint, Vector.rotate(-Math.PI / 2, direction));
        var frontRight = Vector.plus(forwardPoint, Vector.rotate(Math.PI / 2, direction));
        var backwardPoint = Shape.forwardPoint(1, position, Vector.times(-1, direction));
        var backLeft = Vector.plus(backwardPoint, Vector.rotate(Math.PI / 2, direction));
        var backRight = Vector.plus(backwardPoint, Vector.rotate(-Math.PI / 2, direction));
        ctx.beginPath();
        ctx.moveTo(frontLeft.x, frontLeft.y);
        ctx.lineTo(frontRight.x, frontRight.y);
        ctx.lineTo(backLeft.x, backLeft.y);
        ctx.lineTo(backRight.x, backRight.y);
        ctx.fill();
        ctx.closePath();
    };
    return Shape;
}());
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
        var _this = this;
        this.attackRate = 360;
        this.canAttack = function (game) {
            return game.frame - _this.lastAttack > _this.attackRate;
        };
        this.attack = function (c, game) {
            c.life.damage(_this.damage);
            _this.lastAttack = game.frame;
        };
        this.damage = d;
        this.lastAttack = 0;
    }
    return BasicAttack;
}());
var BasicShoot = (function () {
    function BasicShoot() {
        var _this = this;
        this.attackRate = 500;
        this.canAttack = function (game) {
            return game.frame - _this.lastAttack > _this.attackRate;
        };
        this.attack = function (c, game) {
            c.life.damage(_this.damage);
            _this.lastAttack = game.frame;
        };
    }
    return BasicShoot;
}());
var Effect = (function () {
    function Effect() {
    }
    return Effect;
}());
// -*-mode:typescript-*-
var Game = (function () {
    function Game(player) {
        var _this = this;
        this.running = true;
        this.won = false;
        this.lost = false;
        this.increment = function () { _this.frame++; };
        this.run = function () {
            _this.increment();
        };
        this.circles = player.allCircles();
        this.graph = new Graph(player);
        this.graph;
        this.frame = 0;
    }
    return Game;
}());
// -*-mode:typescript-*-
// Circles are cool!
var Circle = (function () {
    function Circle(id, radius, pos, dPos, vel, color, bandColor, direction, speed, turnRate) {
        var _this = this;
        if (dPos === void 0) { dPos = new Vector(0, 0); }
        if (vel === void 0) { vel = Vector.random(); }
        if (color === void 0) { color = 'Black'; }
        if (bandColor === void 0) { bandColor = 'Black'; }
        if (direction === void 0) { direction = 4 * Math.PI * Math.random() - 2 * Math.PI; }
        if (speed === void 0) { speed = 2.5; }
        if (turnRate === void 0) { turnRate = 0.07; }
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
                if (Vector.distance(_this.pos, pos) > .1 * _this.radius) {
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
        this.behave = function (v, game) {
            for (var _i = 0, _a = _this.behaviors; _i < _a.length; _i++) {
                var bhvr = _a[_i];
                if (bhvr.condition(v, game)) {
                    bhvr.consequence(v, game);
                    return;
                }
            }
            if (_this.wander.condition(v, game)) {
                _this.wander.consequence(v, game);
                return;
            }
        };
        this.alive = true;
        // if (!this.direction)
        // this.vel = Vector.random();
        // this.direction = 4 * Math.PI * Math.random() - 2 * Math.PI;
    }
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
        return Vector.distance(c1.pos, c2.pos) < c1.radius + c2.radius;
    };
    return Circle;
}());
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
        _super.call(this, id, 20, new Vector(200, 300));
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Red";
        this.timeAlive = 0;
        this.speed = 1.0,
            this.turnRate = 0.04;
        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
    return RedCircle;
}(Circle));
// -*- mode:typescript -*-
var BlueCircle = (function (_super) {
    __extends(BlueCircle, _super);
    function BlueCircle(id) {
        var behaviors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            behaviors[_i - 1] = arguments[_i];
        }
        _super.call(this, id, 20, new Vector(200, 300));
        this.wander = new WanderCloselyBehavior(); // Default behavior
        this.behaviors = behaviors;
        this.id = id;
        this.color = "Blue";
        this.timeAlive = 0;
        this.life.maxHealth = 10;
        this.life.health = this.life.maxHealth;
    }
    return BlueCircle;
}(Circle));
/*-*-mode:typescript-*-*/
var Player = (function () {
    function Player() {
        var _this = this;
        this.redCircles = [];
        this.blueCircles = [];
        this.allCircles = function () { return _this.redCircles.concat(_this.blueCircles); };
        for (var i = 0; i < 30; i++) {
            this.redCircles.push(new RedCircle(i));
            this.redCircles[i].position(40, 40);
        }
        for (var i = 0; i < 25; i++) {
            this.blueCircles.push(new BlueCircle(10 + i));
            this.blueCircles[i].position(600, 600);
        }
        this.circles = this.allCircles();
        this.circles.map(function (circle) { return circle.behaviors.push(new AttackBehavior()); });
    }
    return Player;
}());
var UnitCard = (function () {
    function UnitCard(circle) {
        this.circle = circle;
        this.experience = 0;
    }
    return UnitCard;
}());
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
        this.condition = function (v, game) {
            if (_this.bAttack.canAttack(game)) {
                _this.targetV = game.graph.closestDirtyVertex(v);
                if (!_this.targetV)
                    return false;
                return true;
            }
            return false;
        };
        this.consequence = function (attackV, game) {
            // Is the attacking circle close to the defending circle?
            if (Vector.distance(attackV.circle.pos, _this.targetV.circle.pos) >
                _this.attackRange * attackV.circle.radius)
                attackV.circle.moveToPosition(_this.targetV.circle.pos, game.graph);
            else if (Math.abs(attackV.circle.angleToCircle(_this.targetV.circle)) < .1) {
                _this.lungeAndAttack(attackV.circle, game);
            }
            else
                attackV.circle.turnToPosition(_this.targetV.circle.pos);
        };
        this.lungeAndAttack = function (attackC, game) {
            attackC.moveForwardByScalarVel(_this.lungeVelocity);
            if (Circle.isClipping(attackC, _this.targetV.circle)) {
                _this.bAttack.attack(_this.targetV.circle, game);
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
    WanderCloselyBehavior.prototype.condition = function (v, game) {
        this.positionToMove = Graph.mean(game.graph.closestCleanVertexes(v, 3));
        if (Vector.distance(this.positionToMove, v.circle.pos) >
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
    WanderCloselyBehavior.prototype.consequence = function (v, game) {
        if (this.outOfBoundCheck(v))
            v.circle.moveToPosition(new Vector(320, 320), game.graph);
        if (this.shouldRunToGroup)
            this.runToGroup(v, game.graph);
        else if (this.shouldWander >= 0) {
            this.wander(v, game.graph);
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
    WanderCloselyBehavior.shouldWanderCount = 60;
    return WanderCloselyBehavior;
}());
/* TODO: Move around the nearest, friendly circle clockwise, switching
 * directions periodically. There could maybe be a damage consequence upon
 * clipping an enemy circle. */
var circleBehavior = (function () {
    function circleBehavior(v, game) {
    }
    // Do the circling behavior always
    circleBehavior.prototype.condition = function (v, game) {
        return true;
    };
    // Move around the nearest circle clockwise, switching directions
    // periodically.
    circleBehavior.prototype.consequence = function () {
        return;
    };
    return circleBehavior;
}());
var simpleAimShootBehavior = (function () {
    function simpleAimShootBehavior() {
        var _this = this;
        this.bShoot = new BasicAttack(1);
        this.attackRange = 300;
        this.condition = function (v, game) {
            if (_this.bShoot.canAttack(game)) {
                _this.targetV = game.graph.closestDirtyVertex(v);
                return true;
            }
            return false;
        };
        this.consequence = function (v, game) {
            v.circle.turnToPosition(_this.targetV.circle.pos);
            if (Math.abs(v.circle.angleToCircle(_this.targetV.circle)) < .05) {
                _this.shootBullet(v, game);
            }
        };
        this.shootBullet = function (v, game) {
            return Bullet.shoot(v.circle.pos, Vector.minus(_this.targetV.circle.pos, v.circle.pos), game.graph);
        };
    }
    return simpleAimShootBehavior;
}());
var chargeOpponentBehavior = (function () {
    function chargeOpponentBehavior() {
    }
    // Do the circling behavior always
    chargeOpponentBehavior.prototype.condition = function (v, game) {
        return true;
    };
    // Move around the nearest circle clockwise, switching directions
    // periodically.
    chargeOpponentBehavior.prototype.consequence = function (v, game) {
        return;
    };
    return chargeOpponentBehavior;
}());
// I DO NEED THIS I think.
var CollisionBucket = (function () {
    function CollisionBucket(graph) {
        var _this = this;
        this.recalculateBucket = function (graph) {
            _this.collisionBucket = [];
            for (var i = 0; i < Math.pow(_this.bucketCount, 2); i++) {
                var nilVertex = void 0;
                _this.collisionBucket[i] = nilVertex;
            }
            for (var _i = 0, _a = graph.vertexes; _i < _a.length; _i++) {
                var v = _a[_i];
                var index = CollisionBucket.gridIndexToCollisionBucket(graph.gridIndexOf(v, _this.lines));
                !_this.collisionBucket[index]
                    ? _this.collisionBucket[index] = [v]
                    : _this.collisionBucket[index].push(v);
            }
        };
        // neighborsOfIndex = (index: { x: string, y: string }): Vertex[] => {
        //     let neighborIndexes = this.indexesAroundRegion(index);
        //     neighborIndexes.map(this.vertexesAtIndex);
        // }
        this.vertexesAtIndex = function (index) {
            return _this.collisionBucket[index.x][index.y];
        };
        this.indexesAroundRegion = function (i) {
            var vOffset = _this.bucketCount;
            return [
                { x: Number(i.x) - 1, y: Number(i.y) - vOffset }, { x: Number(i.x), y: Number(i.y) - vOffset }, { x: Number(i.x) + 1, y: Number(i.y) - vOffset },
                { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x) + 1, y: Number(i.y) },
                { x: Number(i.x) - 1, y: Number(i.y) }, { x: Number(i.x), y: Number(i.y) + vOffset }, { x: Number(i.x) + 1, y: Number(i.y) + vOffset }
            ].map(CollisionBucket.stringifyIndex);
        };
        this.lines = { x: [], y: [] };
        this.bucketCount = 10; // there is actually this.bucketCount ** 2 buckets
        for (var i = 1; i <= this.bucketCount; i++) {
            this.lines.x.push(i * graph.size.width / this.bucketCount);
            this.lines.y.push(i * graph.size.height / this.bucketCount);
        }
        this.collisionBucket = [];
        for (var i = 0; i < Math.pow(this.bucketCount, 2); i++) {
            var nilVertex = void 0;
            this.collisionBucket[i] = nilVertex;
        }
        for (var _i = 0, _a = graph.vertexes; _i < _a.length; _i++) {
            var v = _a[_i];
            var index = CollisionBucket.gridIndexToCollisionBucket(graph.gridIndexOf(v, this.lines));
        }
    }
    CollisionBucket.stringifyIndex = function (index) {
        return { x: String(index.x), y: String(index.y) };
    };
    // TODO: This works perfectly for the bucketcount being 10, but I don't
    // think it will be efficient if the bucketcount is lower, and it won't work
    // if the bucketcount is greater.
    CollisionBucket.gridIndexToCollisionBucket = function (bucketIndex) {
        return 10 * Number(bucketIndex.x) + Number(bucketIndex.y);
    };
    return CollisionBucket;
}());
//-*-mode:typescript-*-
/* Okay, so let there be a game board. It is to be shaped according to the
 * number of pieces that will be on the board or something. There will be two
 * factions of pieces which will correspond to the red side and the blue side.
 * At first, the game will be about having pieces that are good for fighting,
 * then as you go on economic pieces will be added, which will then allow
 * upgrading units, and even constructing new units from a factory. The game
 * will be played by assigning intelligence to the particular pieces---either to
 * defend other specific pieces, or attack unrelentingly---so that then the end
 * goal is one team winning over the other. */
// clears the screen, obvii
function clearScreen() {
    ctx.clearRect(0, 0, 640, 640);
    // ctx.width, ctx.height);
}
var player = new Player();
var game = new Game(player);
testGameLoop();
function testGameLoop() {
    if (game.running) {
        game.graph.behaviorRun(game);
        // game.graph.bulletRun(game);
        game.graph.isThenClipping();
        clearScreen();
        game.graph.drawVertexes();
        game.graph.sumResetDelta();
        game.graph.updateCollisionBucket();
        game.graph.drawTest(15, new Vector(230, 230), new Vector(3, 1));
        game.graph.drawTest(15, new Vector(253, 230), new Vector(1, 2));
        game.graph.drawTest(15, new Vector(223, 100), new Vector(0.5, 0.5));
        game.increment();
    }
    else {
    }
    requestAnimationFrame(testGameLoop);
}
