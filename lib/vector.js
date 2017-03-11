define(["require", "exports"], function (require, exports) {
    "use strict";
    var Vector = (function () {
        function Vector(x, y) {
            this.x = x;
            this.y = y;
        }
        return Vector;
    }());
    Vector.times = function (k, v) { return new Vector(k * v.x, k * v.y); };
    Vector.minus = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    Vector.plus = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.dot = function (v1, v2) { return v1.x * v2.x + v1.y * v2.y; };
    Vector.mag = function (v) { return Math.sqrt(v.x * v.x + v.y * v.y); };
    Vector.unit = function (v) { return Vector.times(1 / Vector.mag(v), v); };
    Vector.distance = function (v1, v2) {
        return Vector.mag(Vector.minus(v2, v1));
    };
    Vector.cross = function (v1, v2) { return v1.x * v2.y - v1.y * v2.x; };
    Vector.angleBetween = function (v1, v2) {
        return Math.atan2(Vector.cross(v1, v2), Vector.dot(v1, v2));
    };
    Vector.angularDirectionTo = function (v1, v2) {
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
    Vector.equalPosition = function (p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    };
    Vector.rotate = function (alpha, vector) {
        var ca = Math.cos(alpha);
        var sa = Math.sin(alpha);
        return new Vector(ca * vector.x - sa * vector.y, sa * vector.x + ca * vector.y);
    };
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    exports.Vector = Vector;
    var Shape = (function () {
        function Shape() {
        }
        return Shape;
    }());
    Shape.forwardPoint = function (size, position, direction) {
        return Vector.plus(position, Vector.times(size, direction));
    };
    Shape.backPoints = function (sideLength, forwardPoint, direction, alpha) {
        var inwardDirection = Vector.times(-1, direction);
        var left = Vector.plus(forwardPoint, Vector.times(sideLength, Vector.rotate(alpha, inwardDirection)));
        var right = Vector.plus(forwardPoint, Vector.times(sideLength, Vector.rotate(-alpha, inwardDirection)));
        return { left: left, right: right };
    };
    Shape.drawRect = function (position, direction, ctx) {
        direction = Vector.times(1 / Vector.mag(direction), direction);
        var forwardPoint = Shape.forwardPoint(16, position, direction);
        var frontLeft = Vector.plus(forwardPoint, Vector.times(2, Vector.rotate(-Math.PI / 2, direction)));
        var frontRight = Vector.plus(forwardPoint, Vector.times(2, Vector.rotate(Math.PI / 2, direction)));
        var backwardPoint = Shape.forwardPoint(1, position, Vector.times(-1, direction));
        var backLeft = Vector.plus(backwardPoint, Vector.times(2, Vector.rotate(Math.PI / 2, direction)));
        var backRight = Vector.plus(backwardPoint, Vector.times(2, Vector.rotate(-Math.PI / 2, direction)));
        ctx.beginPath();
        ctx.moveTo(frontLeft.x, frontLeft.y);
        ctx.lineTo(frontRight.x, frontRight.y);
        ctx.lineTo(backLeft.x, backLeft.y);
        ctx.lineTo(backRight.x, backRight.y);
        ctx.fill();
        ctx.closePath();
    };
    Shape.drawThinTriangle = function (position, direction, ctx) {
        direction = Vector.times(1 / Vector.mag(direction), direction);
        var forwardPoint = Shape.forwardPoint(8, position, direction);
        var backwardPoint = Shape.forwardPoint(8, position, Vector.times(-1, direction));
        var backLeft = Vector.plus(backwardPoint, Vector.times(4, Vector.rotate(Math.PI / 2, direction)));
        var backRight = Vector.plus(backwardPoint, Vector.times(4, Vector.rotate(-Math.PI / 2, direction)));
        ctx.beginPath();
        ctx.moveTo(forwardPoint.x, forwardPoint.y);
        ctx.lineTo(backLeft.x, backLeft.y);
        ctx.lineTo(backRight.x, backRight.y);
        ctx.fill();
        ctx.closePath();
    };
    exports.Shape = Shape;
});
//# sourceMappingURL=vector.js.map