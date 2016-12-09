class Vector {
    constructor(
        public x: number,
        public y: number) {
    }
    // How do I use these in Circle?
    static times(k: number, v: Vector) {
        return new Vector(k * v.x, k * v.y);
    }
    static minus(v1: Vector, v2: Vector) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static plus(v1: Vector, v2: Vector) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static dot(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static mag(v: Vector): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static dist(v1: Vector, v2: Vector): number {
        return Vector.mag(Vector.minus(v2, v1))
    }
    static cross(v1: Vector, v2: Vector) {
        return v1.x * v2.y - v1.y * v2.x
    }
    // Returns an angle between [-pi, pi]. an angle of 0 corresponds to the two
    // vectors being the same.
    static angleBetween(v1: Vector, v2: Vector): number {
        // This is some magic, actually.
        return Math.atan2(Vector.cross(v1, v2), Vector.dot(v1, v2));
    }
    static directionTo(v1: Vector, v2: Vector): number {
        var angle = Vector.angleBetween(v1, v2);
        if (angle === 0) {
            return 0
        } else {
            return angle > 0 ? -1 : 1;
        }
    }
}
