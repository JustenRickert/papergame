define(["require", "exports", "./collisionbucket", "./game", "./vector"], function (require, exports, collisionbucket_1, game_1, vector_1) {
    "use strict";
    var Graph = (function () {
        function Graph(player, enemy, ctx) {
            var _this = this;
            this.bullets = [];
            this.vertexDeltas = [];
            this.dead = [];
            this.reinitializeBehaviors = function () {
                for (var _i = 0, _a = _this.vertexes; _i < _a.length; _i++) {
                    var v = _a[_i];
                    v.circle.reinitializeBehaviors();
                }
            };
            this.giveVertexToDead = function (vertex) {
                _this.dead.push(vertex);
            };
            this.checkDead = function () {
                for (var _i = 0, _a = _this.vertexes; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v.circle.life.health === 0 && v.circle.color !== 'gray') {
                        v.circle.color = 'gray';
                        v.circle.alive = false;
                        _this.giveVertexToDead(v);
                    }
                }
            };
            this.doesNotEdgeHaveVertex = function (vertex, edge) {
                return !_this.doesEdgeHaveVertex(edge, vertex);
            };
            this.doesEdgeHaveVertex = function (edge, vertex) {
                return edge.child.circle.id === vertex.circle.id
                    || edge.parent.circle.id === vertex.circle.id;
            };
            this.clearBullets = function () {
                for (var _i = 0, _a = _this.bullets; _i < _a.length; _i++) {
                    var b = _a[_i];
                    _this.removeBullet(b);
                }
            };
            this.removeBullet = function (b) {
                _this.bullets.splice(_this.bullets.indexOf(b), 1);
            };
            this.outOfBoundsBulletsRun = function () { return _this.bullets.forEach(function (b) {
                return b.isThenOutOfBounds(_this);
            }); };
            this.sumResetDelta = function () {
                var nil = new vector_1.Vector(0, 0);
                for (var i in _this.vertexes) {
                    _this.vertexes[i].circle.pos = vector_1.Vector.plus(_this.vertexes[i].circle.pos, _this.vertexDeltas[i]);
                    _this.vertexDeltas[i] = nil;
                }
                for (var i in _this.edges) {
                    _this.edges[i].dist =
                        vector_1.Vector.distance(_this.edges[i].parent.circle.pos, _this.edges[i].child.circle.pos)
                            - _this.edges[i].parent.circle.radius - _this.edges[i].child.circle.radius;
                }
                _this.edges = Graph.sortedEdges(_this.edges);
                for (var i in _this.vertexes) {
                    _this.vertexes[i].edges = _this.edgesWithCircleAsParent(_this.vertexes[i].circle);
                }
            };
            this.updateCollisionBucket = function () { return _this.collisionBucket.recalculateBucket(_this); };
            this.getVertexes = function (circles) {
                var vertexes = [];
                for (var i in circles) {
                    vertexes.push({
                        circle: circles[i], edges: _this.edgesWithCircleAsParent(circles[i])
                    });
                }
                return vertexes;
            };
            this.addDelta = function (index, v) {
                _this.vertexDeltas[index] = vector_1.Vector.plus(_this.vertexDeltas[index], v);
            };
            this.edgesWithCircle = function (c) {
                return _this.edges.filter(Graph.isParentOrChildOfEdge.bind(_this, c));
            };
            this.edgesWithCircleAsParent = function (c) {
                return _this.edges.filter(Graph.isParentOfEdge.bind(_this, c));
            };
            this.smallestDirtyEdgeFrom = function (vertex) {
                for (var _i = 0, _a = _this.edges.filter(Graph.isDirty); _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e.parent === vertex)
                        return e;
                }
            };
            this.isThenClipping = function () {
                for (var _i = 0, _a = _this.edges; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e.dist <= 0)
                        _this.clippingPush(e);
                    else
                        return;
                }
            };
            this.isThenBulletClipping = function () {
                return _this.bullets.forEach(function (b) { return b.isThenClipping(_this, _this.collisionBucket); });
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
            this.behaviorRun = function (game) {
                return _this.vertexes.forEach(function (v) { return v.circle.behave(v, game); });
            };
            this.bulletRun = function (game) { return _this.bullets.forEach(function (b) { return b.behave(game); }); };
            this.clippingPush = function (edge) {
                var dirTo = vector_1.Vector.minus(edge.parent.circle.pos, edge.child.circle.pos);
                var multiplier = (1 - edge.dist) / 16;
                _this.addDelta(_this.indexOf(edge.parent), vector_1.Vector.times(multiplier * edge.parent.circle.clippingForce, dirTo));
            };
            this.indexOf = function (vertex) {
                for (var i in _this.vertexes) {
                    if (vector_1.Vector.equalPosition(_this.vertexes[i].circle.pos, vertex.circle.pos)) {
                        return Number(i);
                    }
                }
                return -1;
            };
            this.indexOfCircle = function (circle) {
                for (var i in _this.vertexes) {
                    if (vector_1.Vector.equalPosition(_this.vertexes[i].circle.pos, circle.pos))
                        return Number(i);
                }
                return -1;
            };
            this.drawVertexes = function (ctx) {
                _this.vertexes.concat(_this.dead).forEach(function (v) { return _this.drawCircle(v.circle, ctx); });
            };
            this.drawBullets = function (ctx) {
                return _this.bullets.forEach(function (b) { return b.draw(ctx); });
            };
            this.drawCircle = function (circle, ctx) {
                ctx.beginPath();
                ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = circle.color;
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(circle.pos.x + (3 * circle.radius / 4) * Math.sin(circle.direction), circle.pos.y + (3 * circle.radius / 4) * Math.cos(circle.direction));
                ctx.lineTo(circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction + Math.PI / 3), circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction + Math.PI / 3));
                ctx.lineTo(circle.pos.x + (2 * circle.radius / 4) * Math.sin(circle.direction - Math.PI / 3), circle.pos.y + (2 * circle.radius / 4) * Math.cos(circle.direction - Math.PI / 3));
                ctx.fillStyle = circle.triangleColor;
                ctx.fill();
                ctx.closePath();
            };
            this.drawTest = function (sideLength, position, direction, ctx) {
                return vector_1.Shape.drawRect(position, direction, ctx);
            };
            var nilVector = new vector_1.Vector(0, 0);
            this.deadEdges = [];
            this.player = player;
            this.enemy = enemy;
            this.edges = Graph.sortedEdges(Graph.getEdges(player.circles().concat(enemy.circles())));
            this.vertexes = this.getVertexes(player.circles().concat(enemy.circles()));
            for (var i in this.vertexes) {
                this.vertexDeltas[i] = nilVector;
            }
            this.size = { height: game_1.Game.size.height, width: game_1.Game.size.width };
            this.collisionBucket = new collisionbucket_1.CollisionBucket(this);
        }
        return Graph;
    }());
    Graph.isParentOrChildOfEdge = function (circle, edge) {
        return circle.id === edge.parent.circle.id || circle.id === edge.child.circle.id;
    };
    Graph.isParentOfEdge = function (circle, edge) {
        return circle === edge.parent.circle;
    };
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
                vector_1.Vector.distance(edges[i].parent.circle.pos, edges[i].child.circle.pos)
                    - edges[i].parent.circle.radius - edges[i].child.circle.radius;
        }
        return edges;
    };
    Graph.isEdgeChildAlive = function (e) { return e.child.circle.isAlive(); };
    Graph.sortedEdges = function (edges) { return edges.sort(Graph.compareDist); };
    Graph.produceVertex = function (c) {
        return { circle: c, edges: [] };
    };
    Graph.produceEdge = function (v1, v2) {
        return {
            parent: v1,
            child: v2,
            dist: vector_1.Vector.distance(v1.circle.pos, v2.circle.pos)
        };
    };
    Graph.compareDist = function (e1, e2) { return e1.dist - e2.dist; };
    Graph.isDirty = function (e) {
        return e.parent.circle.teamColor !== e.child.circle.teamColor;
    };
    Graph.isClean = function (e) {
        return e.parent.circle.teamColor === e.child.circle.teamColor;
    };
    Graph.mean = function (vertexes) {
        return vector_1.Vector.times(1 / vertexes.length, vertexes.reduce((function (accumVector, v) {
            return vector_1.Vector.plus(accumVector, v.circle.pos);
        }), new vector_1.Vector(0, 0)));
    };
    exports.Graph = Graph;
});
//# sourceMappingURL=graph.js.map