import { PhysicsObject } from '../core/PhysicsObject.js';
import { Vector2 } from '../2d-3d.js';

export class CompoundShape extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.shapes = opts.shapes || [];
        this.angle = opts.angle || 0;
        this.angularVelocity = opts.angularVelocity || 0;
        this.calculateMassProperties();
    }

    calculateMassProperties() {
        let totalMass = 0;
        let centerOfMass = new Vector2(0, 0);
        let momentOfInertia = 0;

        for (const shape of this.shapes) {
            totalMass += shape.mass;
            centerOfMass.x += shape.mass * (this.x + shape.x);
            centerOfMass.y += shape.mass * (this.y + shape.y);
        }

        centerOfMass.x /= totalMass;
        centerOfMass.y /= totalMass;

        for (const shape of this.shapes) {
            const r = new Vector2(
                this.x + shape.x - centerOfMass.x,
                this.y + shape.y - centerOfMass.y
            );
            momentOfInertia += shape.mass * r.dot(r);
        }

        this.mass = totalMass;
        this.centerOfMass = centerOfMass;
        this.momentOfInertia = momentOfInertia;
    }

    update(delta) {
        super.update(delta);
        this.angle += this.angularVelocity * delta;

        for (const shape of this.shapes) {
            const r = new Vector2(shape.x, shape.y);
            r.rotate(this.angle);
            shape.x = this.x + r.x;
            shape.y = this.y + r.y;
            shape.angle = this.angle;
        }
    }

    applyForce(fx, fy, px, py) {
        super.applyForce(fx, fy);
        if (px !== undefined && py !== undefined) {
            const r = new Vector2(px - this.x, py - this.y);
            const torque = r.cross(new Vector2(fx, fy));
            this.angularVelocity += torque / this.momentOfInertia;
        }
    }

    draw(ctx) {
        for (const shape of this.shapes) {
            shape.draw(ctx);
        }
    }

    checkCollision(other) {
        for (const shape of this.shapes) {
            if (shape.checkCollision(other)) {
                return true;
            }
        }
        return false;
    }
}
