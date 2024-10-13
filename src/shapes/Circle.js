import { PhysicsObject } from '../core/PhysicsObject.js';
import { ComplexShape } from './ComplexShape.js';

export class Circle extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.radius = opts.radius || 10;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    checkCollision(other) {
        if (other instanceof Circle) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (this.radius + other.radius);
        } else if (other instanceof ComplexShape) {
            return other.checkCircleCollision(this);
        }
        return false;
    }

    resolveCollision(other) {
        if (other instanceof Circle) {
            this.resolveCircleCollision(other);
        } else if (other instanceof ComplexShape) {
            other.resolveCircleCollision(this);
        }
    }

    resolveCircleCollision(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = (this.radius + other.radius) - distance;
        
        if (overlap > 0) {
            // Move circles apart
            const moveX = (dx / distance) * overlap * 0.5;
            const moveY = (dy / distance) * overlap * 0.5;
            this.x -= moveX;
            this.y -= moveY;
            other.x += moveX;
            other.y += moveY;

            // Calculate new velocities
            const nx = dx / distance;
            const ny = dy / distance;
            const kx = this.vx - other.vx;
            const ky = this.vy - other.vy;
            const p = 2 * (nx * kx + ny * ky) / (this.mass + other.mass);
            
            this.vx = this.vx - p * other.mass * nx;
            this.vy = this.vy - p * other.mass * ny;
            other.vx = other.vx + p * this.mass * nx;
            other.vy = other.vy + p * this.mass * ny;
        }
    }
}
