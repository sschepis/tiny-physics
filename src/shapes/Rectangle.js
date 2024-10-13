import { PhysicsObject } from '../core/PhysicsObject.js';
import { Circle } from './Circle.js';

export class Rectangle extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.width = opts.width || 20;
        this.height = opts.height || 20;
        this.angle = opts.angle || 0;
        this.angularVelocity = opts.angularVelocity || 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update(others, delta) {
        super.update(others, delta);
        this.angle += this.angularVelocity * delta;
    }

    checkCollision(other) {
        if (other instanceof Circle) {
            return this.checkCircleCollision(other);
        } else if (other instanceof Rectangle) {
            return this.checkRectangleCollision(other);
        }
        return false;
    }

    checkCircleCollision(circle) {
        // Rotate circle's center point back
        const unrotatedCircleX = Math.cos(this.angle) * (circle.x - this.x) -
                                 Math.sin(this.angle) * (circle.y - this.y) + this.x;
        const unrotatedCircleY = Math.sin(this.angle) * (circle.x - this.x) +
                                 Math.cos(this.angle) * (circle.y - this.y) + this.y;

        // Closest point in the rectangle to the center of circle rotated backwards
        let closestX, closestY;

        // Find the unrotated closest x point from center of unrotated circle
        if (unrotatedCircleX < this.x - this.width / 2) {
            closestX = this.x - this.width / 2;
        } else if (unrotatedCircleX > this.x + this.width / 2) {
            closestX = this.x + this.width / 2;
        } else {
            closestX = unrotatedCircleX;
        }

        // Find the unrotated closest y point from center of unrotated circle
        if (unrotatedCircleY < this.y - this.height / 2) {
            closestY = this.y - this.height / 2;
        } else if (unrotatedCircleY > this.y + this.height / 2) {
            closestY = this.y + this.height / 2;
        } else {
            closestY = unrotatedCircleY;
        }

        // Determine collision
        const distance = Math.sqrt(
            (unrotatedCircleX - closestX) * (unrotatedCircleX - closestX) +
            (unrotatedCircleY - closestY) * (unrotatedCircleY - closestY)
        );

        return distance < circle.radius;
    }

    checkRectangleCollision(other) {
        // Implement SAT (Separating Axis Theorem) for rectangle-rectangle collision
        const axes = this.getAxes().concat(other.getAxes());
        for (let axis of axes) {
            const p1 = this.project(axis);
            const p2 = other.project(axis);
            if (!this.overlap(p1, p2)) {
                return false;
            }
        }
        return true;
    }

    getAxes() {
        const vertices = this.getVertices();
        return [
            { x: vertices[1].x - vertices[0].x, y: vertices[1].y - vertices[0].y },
            { x: vertices[1].x - vertices[2].x, y: vertices[1].y - vertices[2].y }
        ];
    }

    getVertices() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        return [
            {
                x: this.x + (-this.width / 2 * cos - -this.height / 2 * sin),
                y: this.y + (-this.width / 2 * sin + -this.height / 2 * cos)
            },
            {
                x: this.x + (this.width / 2 * cos - -this.height / 2 * sin),
                y: this.y + (this.width / 2 * sin + -this.height / 2 * cos)
            },
            {
                x: this.x + (this.width / 2 * cos - this.height / 2 * sin),
                y: this.y + (this.width / 2 * sin + this.height / 2 * cos)
            },
            {
                x: this.x + (-this.width / 2 * cos - this.height / 2 * sin),
                y: this.y + (-this.width / 2 * sin + this.height / 2 * cos)
            }
        ];
    }

    project(axis) {
        const vertices = this.getVertices();
        let min = axis.x * vertices[0].x + axis.y * vertices[0].y;
        let max = min;
        for (let i = 1; i < vertices.length; i++) {
            const p = axis.x * vertices[i].x + axis.y * vertices[i].y;
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        return { min, max };
    }

    overlap(p1, p2) {
        return !(p1.max < p2.min || p2.max < p1.min);
    }

    resolveCollision(other) {
        // Implement collision response here
        // For simplicity, we'll just reverse velocities
        const tempVx = this.vx;
        const tempVy = this.vy;
        this.vx = other.vx;
        this.vy = other.vy;
        other.vx = tempVx;
        other.vy = tempVy;

        // Exchange some angular velocity
        const tempAv = this.angularVelocity;
        this.angularVelocity = other.angularVelocity;
        other.angularVelocity = tempAv;
    }
}
