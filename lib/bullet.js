define(["require", "exports", "./vector"], function (require, exports, vector_1) {
    "use strict";
    var Bullet = (function () {
        function Bullet(position, direction, color, damage) {
            var _this = this;
            this.damage = 2;
            this.size = 2;
            this.isDirty = function (v) { return _this.color !== v.circle.teamColor; };
            this.behave = function (game) {
                if (_this.isThenClipping(game.graph, game.graph.collisionBucket))
                    return;
                else
                    _this.moveForward(game);
            };
            this.isThenClipping = function (graph, cb) {
                var vertexes = cb.vertexesAtIndex(cb.gridIndexOf(_this.pos)).filter(_this.isDirty);
                for (var _i = 0, vertexes_1 = vertexes; _i < vertexes_1.length; _i++) {
                    var v = vertexes_1[_i];
                    if (_this.isClippingVertex(v) && v.circle.isAlive()) {
                        _this.clip(v, graph);
                        return true;
                    }
                }
                return false;
            };
            this.isOutOfBounds = function (graph) {
                return _this.pos.x < -graph.size.width / 2
                    || _this.pos.x > 3 * graph.size.width / 2
                    || _this.pos.y < -graph.size / 2
                    || _this.pos.y > 3 * graph.size.height / 2;
            };
            this.isThenOutOfBounds = function (graph) {
                if (_this.isOutOfBounds(graph))
                    graph.removeBullet(_this);
            };
            this.clip = function (v, graph) {
                v.circle.life.damage(_this.damage);
                graph.removeBullet(_this);
            };
            this.isClippingVertex = function (vertex) {
                return vector_1.Vector.distance(vertex.circle.pos, _this.pos) < vertex.circle.radius;
            };
            this.moveForward = function (game) {
                _this.pos = vector_1.Vector.plus(_this.pos, _this.vel);
            };
            this.draw = function () { return vector_1.Shape.drawThinTriangle(_this.pos, _this.vel); };
            this.pos = position;
            this.vel = direction;
            this.color = color;
        }
        return Bullet;
    }());
    Bullet.shoot = function (position, direction, color, damage, graph) {
        graph.bullets.push(new Bullet(position, direction, color, damage));
    };
    exports.Bullet = Bullet;
});
//# sourceMappingURL=bullet.js.map