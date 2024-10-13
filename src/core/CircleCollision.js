import { Vector2 } from '../2d-3d.js';

export class CircleCollision {
    static detectCircleCircle(circle1, circle2, delta) {
        const relativeVelocity = new Vector2(
            (circle2.vx - circle1.vx) * delta,
            (circle2.vy - circle1.vy) * delta
        );
        const initialDistance = new Vector2(circle2.x - circle1.x, circle2.y - circle1.y);
        const totalRadius = circle1.radius + circle2.radius;

        // Early exit if circles are moving away from each other
        if (initialDistance.dot(relativeVelocity) > 0) {
            return null;
        }

        const a = relativeVelocity.dot(relativeVelocity);
        const b = 2 * initialDistance.dot(relativeVelocity);
        const c = initialDistance.dot(initialDistance) - totalRadius * totalRadius;

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return null; // No collision
        }

        const t = (-b - Math.sqrt(discriminant)) / (2 * a);

        if (t < 0 || t > 1) {
            return null; // Collision happens outside the current time step
        }

        const collisionPoint = new Vector2(
            circle1.x + circle1.vx * t * delta,
            circle1.y + circle1.vy * t * delta
        );

        return {
            time: t,
            point: collisionPoint
        };
    }

    static detectCircleCircleWithRotation(circle1, circle2, delta) {
        // Implement continuous collision detection with rotation
        // This is a placeholder and needs to be implemented
    }

    // ... (keep other methods)

    static debugRender(ctx, circle1, circle2, collision) {
        // Draw circles
        ctx.beginPath();
        ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'blue';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // Draw collision point if exists
        if (collision) {
            ctx.beginPath();
            ctx.arc(collision.point.x, collision.point.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'green';
            ctx.fill();
        }
    }
}
