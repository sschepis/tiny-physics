import { PhysicsForce } from '../core/PhysicsEngine.js';
import { Vector2 } from '../2d-3d.js';

export class GravityForce extends PhysicsForce {
    constructor(gravity) {
        super();
        this.gravity = gravity instanceof Vector2 ? gravity : new Vector2(0, 9.81);
    }

    apply(obj, delta) {
        obj.applyForce(this.gravity.x * obj.mass, this.gravity.y * obj.mass);
    }
}

export class DragForce extends PhysicsForce {
    constructor(coefficient) {
        super();
        this.coefficient = coefficient || 0.01;
    }

    apply(obj, delta) {
        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        const dragMagnitude = this.coefficient * speed * speed;
        const dragForce = new Vector2(-obj.vx, -obj.vy);
        if (speed > 0) {
            const normalized = dragForce.norm();
            dragForce.x = normalized.x * dragMagnitude;
            dragForce.y = normalized.y * dragMagnitude;
        }
        obj.applyForce(dragForce.x, dragForce.y);
    }
}

export class SpringForce extends PhysicsForce {
    constructor(anchor, restLength, stiffness) {
        super();
        this.anchor = anchor instanceof Vector2 ? anchor : new Vector2(anchor.x, anchor.y);
        this.restLength = restLength;
        this.stiffness = stiffness;
    }

    apply(obj, delta) {
        const force = new Vector2(this.anchor.x - obj.x, this.anchor.y - obj.y);
        const currentLength = force.mag();
        const stretch = currentLength - this.restLength;
        const normalized = force.norm();
        force.x = normalized.x * this.stiffness * stretch;
        force.y = normalized.y * this.stiffness * stretch;
        obj.applyForce(force.x, force.y);
    }
}

export class AttractionForce extends PhysicsForce {
    constructor(center, strength, minDistance, maxDistance) {
        super();
        this.center = center instanceof Vector2 ? center : new Vector2(center.x, center.y);
        this.strength = strength;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
    }

    apply(obj, delta) {
        const force = new Vector2(this.center.x - obj.x, this.center.y - obj.y);
        const distance = force.mag();
        
        if (distance > this.minDistance && distance < this.maxDistance) {
            const strength = this.strength / (distance * distance);
            const normalized = force.norm();
            force.x = normalized.x * strength;
            force.y = normalized.y * strength;
            obj.applyForce(force.x, force.y);
        }
    }
}

export class WindForce extends PhysicsForce {
    constructor(direction, strength, variability) {
        super();
        this.direction = direction instanceof Vector2 ? direction.norm() : new Vector2(1, 0);
        this.strength = strength;
        this.variability = variability || 0;
    }

    apply(obj, delta) {
        const variation = new Vector2(
            (Math.random() - 0.5) * this.variability,
            (Math.random() - 0.5) * this.variability
        );
        const force = new Vector2(this.direction.x + variation.x, this.direction.y + variation.y);
        const normalized = force.norm();
        force.x = normalized.x * this.strength;
        force.y = normalized.y * this.strength;
        obj.applyForce(force.x, force.y);
    }
}

export class WrapForce extends PhysicsForce {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    apply(obj, delta) {
        if (obj.x > this.width) obj.x = 0;
        if (obj.x < 0) obj.x = this.width;
        if (obj.y > this.height) obj.y = 0;
        if (obj.y < 0) obj.y = this.height;
    }
}

export const wrap = (width, height) => new WrapForce(width, height);
export const drag = (coefficient) => new DragForce(coefficient);
export const gravity = (gravityVector) => new GravityForce(gravityVector);
export const spring = (anchor, restLength, stiffness) => new SpringForce(anchor, restLength, stiffness);
export const attraction = (center, strength, minDistance, maxDistance) => new AttractionForce(center, strength, minDistance, maxDistance);
export const wind = (direction, strength, variability) => new WindForce(direction, strength, variability);
