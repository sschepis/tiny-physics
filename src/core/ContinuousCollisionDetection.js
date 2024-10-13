import { Vector2 } from '../2d-3d.js';
import { CircleCollision } from './CircleCollision.js';
import { PolygonCollision } from './PolygonCollision.js';
import { Circle } from '../shapes/Circle.js';
import { ComplexShape } from '../shapes/ComplexShape.js';

export class ContinuousCollisionDetection {
    static detectCollision(obj1, obj2, delta) {
        if (obj1 instanceof Circle && obj2 instanceof Circle) {
            return CircleCollision.detectCircleCircle(obj1, obj2, delta);
        } else if (obj1 instanceof ComplexShape && obj2 instanceof ComplexShape) {
            return PolygonCollision.detectPolygonPolygon(obj1, obj2, delta);
        } else if ((obj1 instanceof Circle && obj2 instanceof ComplexShape) ||
                   (obj1 instanceof ComplexShape && obj2 instanceof Circle)) {
            return this.detectCirclePolygon(
                obj1 instanceof Circle ? obj1 : obj2,
                obj1 instanceof ComplexShape ? obj1 : obj2,
                delta
            );
        }

        return null;
    }

    static detectCollisionWithRotation(obj1, obj2, delta) {
        if (obj1 instanceof Circle && obj2 instanceof Circle) {
            return CircleCollision.detectCircleCircleWithRotation(obj1, obj2, delta);
        } else if (obj1 instanceof ComplexShape && obj2 instanceof ComplexShape) {
            return PolygonCollision.detectPolygonPolygonWithRotation(obj1, obj2, delta);
        } else if ((obj1 instanceof Circle && obj2 instanceof ComplexShape) ||
                   (obj1 instanceof ComplexShape && obj2 instanceof Circle)) {
            // Implement circle-polygon collision with rotation
            // This is a placeholder and needs to be implemented
            return null;
        }

        return null;
    }

    static detectCirclePolygon(circle, polygon, delta) {
        const relativeVelocity = new Vector2(
            (polygon.vx - circle.vx) * delta,
            (polygon.vy - circle.vy) * delta
        );

        let minCollisionTime = Infinity;
        let collisionPoint = null;
        let collisionNormal = null;

        // Check collision with polygon edges
        for (let i = 0; i < polygon.vertices.length; i++) {
            const edge = PolygonCollision.getEdge(polygon.vertices, i);
            const normal = PolygonCollision.getNormal(edge);

            const result = CircleCollision.detectCircleEdgeCollision(circle, edge, normal, relativeVelocity);
            if (result && result.time < minCollisionTime) {
                minCollisionTime = result.time;
                collisionPoint = result.point;
                collisionNormal = normal;
            }
        }

        // Check collision with polygon vertices
        for (const vertex of polygon.vertices) {
            const result = CircleCollision.detectCirclePointCollision(circle, vertex, relativeVelocity);
            if (result && result.time < minCollisionTime) {
                minCollisionTime = result.time;
                collisionPoint = result.point;
                collisionNormal = new Vector2(
                    circle.x - vertex.x,
                    circle.y - vertex.y
                ).normalize();
            }
        }

        if (minCollisionTime <= 1) {
            return {
                time: minCollisionTime,
                point: collisionPoint,
                normal: collisionNormal
            };
        }

        return null;
    }

    static debugRender(ctx, obj1, obj2, collision) {
        if (obj1 instanceof Circle && obj2 instanceof Circle) {
            CircleCollision.debugRender(ctx, obj1, obj2, collision);
        } else if (obj1 instanceof ComplexShape && obj2 instanceof ComplexShape) {
            PolygonCollision.debugRender(ctx, obj1, obj2, collision);
        } else if (obj1 instanceof Circle && obj2 instanceof ComplexShape) {
            this.debugRenderCirclePolygon(ctx, obj1, obj2, collision);
        } else if (obj1 instanceof ComplexShape && obj2 instanceof Circle) {
            this.debugRenderCirclePolygon(ctx, obj2, obj1, collision);
        }
    }

    static debugRenderCirclePolygon(ctx, circle, polygon, collision) {
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'blue';
        ctx.stroke();

        // Draw polygon
        PolygonCollision.drawPolygon(ctx, polygon, 'red');

        // Draw collision point and normal if exists
        if (collision) {
            ctx.beginPath();
            ctx.arc(collision.point.x, collision.point.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'green';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(collision.point.x, collision.point.y);
            ctx.lineTo(
                collision.point.x + collision.normal.x * 20,
                collision.point.y + collision.normal.y * 20
            );
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }
    }
}
