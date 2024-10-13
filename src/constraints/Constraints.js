import { Vector2 } from '../2d-3d.js';

export class DistanceConstraint {
    constructor(objectA, objectB, distance, stiffness = 1) {
        this.objectA = objectA;
        this.objectB = objectB;
        this.distance = distance;
        this.stiffness = stiffness;
    }

    resolve() {
        const dx = this.objectB.x - this.objectA.x;
        const dy = this.objectB.y - this.objectA.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const difference = (currentDistance - this.distance) / currentDistance;

        const moveX = dx * 0.5 * difference * this.stiffness;
        const moveY = dy * 0.5 * difference * this.stiffness;

        this.objectA.x += moveX;
        this.objectA.y += moveY;
        this.objectB.x -= moveX;
        this.objectB.y -= moveY;
    }
}

export class AngleConstraint {
    constructor(objectA, objectB, objectC, angle, stiffness = 1) {
        this.objectA = objectA;
        this.objectB = objectB;
        this.objectC = objectC;
        this.angle = angle;
        this.stiffness = stiffness;
    }

    resolve() {
        const vectorBA = new Vector2(this.objectA.x - this.objectB.x, this.objectA.y - this.objectB.y);
        const vectorBC = new Vector2(this.objectC.x - this.objectB.x, this.objectC.y - this.objectB.y);

        const currentAngle = Math.atan2(vectorBA.cross(vectorBC), vectorBA.dot(vectorBC));
        const diff = this.angle - currentAngle;

        const rotationAmount = diff * this.stiffness;

        this.rotatePoint(this.objectA, this.objectB, rotationAmount);
        this.rotatePoint(this.objectC, this.objectB, -rotationAmount);
    }

    rotatePoint(point, center, angle) {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        point.x = center.x + (dx * cos - dy * sin);
        point.y = center.y + (dx * sin + dy * cos);
    }
}
