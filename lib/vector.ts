// -*- mode:typescript -*-

import { GAME_CANVAS, GAME_CTX } from './globaldeclarations'

export class Vector {
    constructor(public x: number, public y: number) { }

    static times = (k: number, v: Vector): Vector => new Vector(k * v.x, k * v.y);

    static minus = (v1: Vector, v2: Vector): Vector =>
        new Vector(v1.x - v2.x, v1.y - v2.y);

    static plus = (v1: Vector, v2: Vector): Vector =>
        new Vector(v1.x + v2.x, v1.y + v2.y);

    static dot = (v1: Vector, v2: Vector): number => v1.x * v2.x + v1.y * v2.y;

    static mag = (v: Vector): number => Math.sqrt(v.x * v.x + v.y * v.y);

    static unit = (v: Vector): Vector => Vector.times(1 / Vector.mag(v), v);

    static distance = (v1: Vector, v2: Vector): number =>
        Vector.mag(Vector.minus(v2, v1));

    static cross = (v1: Vector, v2: Vector): number => v1.x * v2.y - v1.y * v2.x;

    // Returns an angle between [-pi, pi]. an angle of 0 corresponds to the two
    // vectors being the same.
    static angleBetween = (v1: Vector, v2: Vector): number =>
        Math.atan2(Vector.cross(v1, v2), Vector.dot(v1, v2));

    static angularDirectionTo = (v1: Vector, v2: Vector): number => {
        var angle = Vector.angleBetween(v1, v2);
        if (angle === 0) {
            return 0;
        } else {
            return angle > 0 ? -1 : 1;
        }
    }

    static random = (): Vector =>
        new Vector(2 * Math.random() - 1, 2 * Math.random() - 1);

    static equalPosition = (p1: Vector, p2: Vector): boolean =>
        p1.x === p2.x && p1.y === p2.y

    // https://en.wikipedia.org/wiki/Rotation_matrix/
    static rotate = (alpha: number, vector: Vector): Vector => {
        let ca = Math.cos(alpha);
        let sa = Math.sin(alpha);
        return new Vector(ca * vector.x - sa * vector.y, sa * vector.x + ca * vector.y);
    }

    static norm = (v: Vector): Vector => {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
}

export class Shape {

    // I know what these next two are, but don't use them
    static forwardPoint = (size: number, position: Vector, direction: Vector): Vector =>
        Vector.plus(position, Vector.times(size, direction))

    static backPoints = (sideLength: number, forwardPoint: Vector,
        direction: Vector, alpha: number): { left: Vector, right: Vector } => {
        let inwardDirection: Vector = Vector.times(-1, direction);

        let left = Vector.plus(forwardPoint,
            Vector.times(sideLength,
                Vector.rotate(alpha, inwardDirection)));
        let right = Vector.plus(forwardPoint,
            Vector.times(sideLength,
                Vector.rotate(-alpha, inwardDirection))); // note the -alpha

        return { left, right }
    }

    static drawRect = (position: Vector, direction: Vector): void => {
        direction = Vector.times(1 / Vector.mag(direction), direction);

        let forwardPoint = Shape.forwardPoint(16, position, direction);
        let frontLeft = Vector.plus(
            forwardPoint,
            Vector.times(2, Vector.rotate(-Math.PI / 2, direction)));
        let frontRight = Vector.plus(forwardPoint, Vector.times(2, Vector.rotate(Math.PI / 2, direction)));

        let backwardPoint = Shape.forwardPoint(1, position, Vector.times(-1, direction));
        let backLeft = Vector.plus(backwardPoint, Vector.times(2, Vector.rotate(Math.PI / 2, direction)));
        let backRight = Vector.plus(backwardPoint, Vector.times(2, Vector.rotate(-Math.PI / 2, direction)));

        GAME_CTX.beginPath();
        GAME_CTX.moveTo(frontLeft.x, frontLeft.y);
        GAME_CTX.lineTo(frontRight.x, frontRight.y);
        GAME_CTX.lineTo(backLeft.x, backLeft.y);
        GAME_CTX.lineTo(backRight.x, backRight.y);

        GAME_CTX.fill();
        GAME_CTX.closePath();
    }

    static drawThinTriangle = (position: Vector, direction: Vector): void => {
        direction = Vector.times(1 / Vector.mag(direction), direction);

        let forwardPoint = Shape.forwardPoint(8, position, direction);

        let backwardPoint = Shape.forwardPoint(8, position, Vector.times(-1, direction));
        let backLeft = Vector.plus(backwardPoint, Vector.times(4, Vector.rotate(Math.PI / 2, direction)));
        let backRight = Vector.plus(backwardPoint, Vector.times(4, Vector.rotate(-Math.PI / 2, direction)));

        GAME_CTX.beginPath();
        GAME_CTX.moveTo(forwardPoint.x, forwardPoint.y);
        GAME_CTX.lineTo(backLeft.x, backLeft.y);
        GAME_CTX.lineTo(backRight.x, backRight.y);

        GAME_CTX.fill();
        GAME_CTX.closePath();
    }
} 
