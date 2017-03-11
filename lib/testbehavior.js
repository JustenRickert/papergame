define(["require", "exports", "./vector", "./graph"], function (require, exports, vector_1, graph_1) {
    "use strict";
    var EnCircleBehavior = (function () {
        function EnCircleBehavior(c) {
            var _this = this;
            this.reinitialize = function () {
            };
            this.condition = function (v, game) {
                _this.increment(v);
                return true;
            };
            this.consequence = function (v, game) {
                v.circle.direction -= _this.alpha;
                v.circle.moveForwardByVec(new vector_1.Vector(Math.cos(_this.omega) * v.circle.speed, Math.sin(_this.omega) * v.circle.speed));
            };
            this.increment = function (v) {
                _this.omega += _this.alpha;
                _this.omega = _this.omega % (2 * Math.PI);
                v.circle.moveForwardByVec(new vector_1.Vector(Math.cos(_this.omega), Math.sin(_this.omega)));
            };
            c.speed = 3;
            this.omega = 0;
            this.radius = 320;
            this.alpha = Math.PI * c.speed / this.radius;
        }
        return EnCircleBehavior;
    }());
    exports.EnCircleBehavior = EnCircleBehavior;
    var SimpleFollow = (function () {
        function SimpleFollow(c) {
            var _this = this;
            this.reinitialize = function () { };
            this.condition = function (attackV, game) {
                _this.targetEdge = attackV.edges.filter(graph_1.Graph.isDirty).filter(graph_1.Graph.isEdgeChildAlive)[0];
                return true;
            };
            this.consequence = function (attackV, game) {
                attackV.circle.moveToPosition(_this.targetEdge.child.circle.pos, game.graph);
            };
            c.speed = 1.5;
        }
        return SimpleFollow;
    }());
    exports.SimpleFollow = SimpleFollow;
});
//# sourceMappingURL=testbehavior.js.map