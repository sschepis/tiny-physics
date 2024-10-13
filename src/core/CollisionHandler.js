import { ContinuousCollisionDetection } from './ContinuousCollisionDetection.js';

export class CollisionHandler {
    static handleCollisions(objects, quadtree, delta) {
        const collisions = [];
        
        for (let i = 0; i < objects.length; i++) {
            const obj1 = objects[i];
            const range = {
                x: obj1.x - obj1.radius,
                y: obj1.y - obj1.radius,
                width: obj1.radius * 2,
                height: obj1.radius * 2
            };
            const potentialCollisions = quadtree.query(range);
            
            for (let j = 0; j < potentialCollisions.length; j++) {
                const obj2 = potentialCollisions[j];
                if (obj1 !== obj2) {
                    const collision = ContinuousCollisionDetection.detectCollision(obj1, obj2, delta);
                    if (collision) {
                        collisions.push({ obj1, obj2, collision });
                    }
                }
            }
        }
        
        // Sort collisions by time
        collisions.sort((a, b) => a.collision.time - b.collision.time);
        
        // Resolve collisions
        for (let collision of collisions) {
            this.resolveCollision(collision.obj1, collision.obj2, collision.collision);
        }
    }

    static resolveCollision(obj1, obj2, collision) {
        // Move objects to collision point
        obj1.x = collision.point.x - obj1.vx * collision.time;
        obj1.y = collision.point.y - obj1.vy * collision.time;
        obj2.x = collision.point.x - obj2.vx * collision.time;
        obj2.y = collision.point.y - obj2.vy * collision.time;

        // Calculate collision normal
        const normal = {
            x: obj2.x - obj1.x,
            y: obj2.y - obj1.y
        };
        const normalMagnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= normalMagnitude;
        normal.y /= normalMagnitude;

        // Calculate relative velocity
        const relativeVelocity = {
            x: obj1.vx - obj2.vx,
            y: obj1.vy - obj2.vy
        };

        // Calculate relative velocity in terms of the normal direction
        const velocityAlongNormal = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

        // Do not resolve if velocities are separating
        if (velocityAlongNormal > 0) {
            return;
        }

        // Calculate restitution (bounciness)
        const restitution = Math.min(obj1.restitution, obj2.restitution);

        // Calculate impulse scalar
        let impulseScalar = -(1 + restitution) * velocityAlongNormal;
        impulseScalar /= 1 / obj1.mass + 1 / obj2.mass;

        // Apply impulse
        const impulse = {
            x: impulseScalar * normal.x,
            y: impulseScalar * normal.y
        };

        obj1.vx += impulse.x / obj1.mass;
        obj1.vy += impulse.y / obj1.mass;
        obj2.vx -= impulse.x / obj2.mass;
        obj2.vy -= impulse.y / obj2.mass;
    }
}
