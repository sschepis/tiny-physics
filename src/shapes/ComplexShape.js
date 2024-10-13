import { PhysicsObject } from '../core/PhysicsObject.js';
import { Vector2 } from '../2d-3d.js';

export class ComplexShape extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.vertices = opts.vertices || [];
        this.angle = opts.angle || 0;
        this.angularVelocity = opts.angularVelocity || 0;
    }

    update(others, delta) {
        super.update(others, delta);
        this.angle += this.angularVelocity * delta;
        // Update vertex positions based on the new angle
        this.updateVertices();
    }

    updateVertices() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);
        this.transformedVertices = this.vertices.map(v => ({
            x: v.x * cos - v.y * sin + this.x,
            y: v.x * sin + v.y * cos + this.y
        }));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
        for (let i = 1; i < this.transformedVertices.length; i++) {
            ctx.lineTo(this.transformedVertices[i].x, this.transformedVertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    checkCollision(other) {
        if (other instanceof ComplexShape) {
            return this.checkSATCollision(other);
        }
        // Implement collision checks with other shapes here
        return false;
    }

    checkSATCollision(other) {
        const axes1 = this.getAxes();
        const axes2 = other.getAxes();
        const axes = [...axes1, ...axes2];

        for (let axis of axes) {
            const projection1 = this.project(axis);
            const projection2 = other.project(axis);

            if (!this.overlap(projection1, projection2)) {
                return false;
            }
        }
        return true;
    }

    getAxes() {
        const axes = [];
        for (let i = 0; i < this.transformedVertices.length; i++) {
            const v1 = this.transformedVertices[i];
            const v2 = this.transformedVertices[(i + 1) % this.transformedVertices.length];
            const edge = new Vector2(v2.x - v1.x, v2.y - v1.y);
            const normal = new Vector2(-edge.y, edge.x).normalize();
            axes.push(normal);
        }
        return axes;
    }

    project(axis) {
        let min = Infinity;
        let max = -Infinity;
        for (let vertex of this.transformedVertices) {
            const projection = axis.x * vertex.x + axis.y * vertex.y;
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }
        return { min, max };
    }

    overlap(projection1, projection2) {
        return projection1.min <= projection2.max && projection2.min <= projection1.max;
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
