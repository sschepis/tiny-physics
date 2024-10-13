import { Vector2 } from '../2d-3d.js';

export class PolygonCollision {
    static detectPolygonPolygon(poly1, poly2, delta) {
        const relativeVelocity = new Vector2(
            (poly2.vx - poly1.vx) * delta,
            (poly2.vy - poly1.vy) * delta
        );

        // Early exit if polygons are moving away from each other
        const centerDiff = new Vector2(poly2.x - poly1.x, poly2.y - poly1.y);
        if (centerDiff.dot(relativeVelocity) > 0) {
            return null;
        }

        let minCollisionTime = Infinity;
        let collisionPoint = null;
        let collisionNormal = null;

        const axes = [...this.getAxes(poly1), ...this.getAxes(poly2)];

        for (const axis of axes) {
            const result = this.detectCollisionOnAxis(poly1, poly2, axis, relativeVelocity);
            if (!result) {
                return null; // No collision on this axis, so no collision overall
            }
            if (result.time < minCollisionTime) {
                minCollisionTime = result.time;
                collisionPoint = result.point;
                collisionNormal = axis;
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

    static detectPolygonPolygonWithRotation(poly1, poly2, delta) {
        // Implement continuous collision detection with rotation
        // This is a placeholder and needs to be implemented
    }

    static getAxes(polygon) {
        const axes = [];
        for (let i = 0; i < polygon.vertices.length; i++) {
            const v1 = polygon.vertices[i];
            const v2 = polygon.vertices[(i + 1) % polygon.vertices.length];
            const edge = new Vector2(v2.x - v1.x, v2.y - v1.y);
            const normal = new Vector2(-edge.y, edge.x).normalize();
            axes.push(normal);
        }
        return axes;
    }

    static detectCollisionOnAxis(poly1, poly2, axis, relativeVelocity) {
        const [min1, max1] = this.projectPolygon(poly1, axis);
        const [min2, max2] = this.projectPolygon(poly2, axis);

        const relativeMotion = relativeVelocity.dot(axis);

        if (relativeMotion === 0) {
            return null; // Polygons are moving parallel to the axis
        }

        const t = (min1 - max2) / relativeMotion;

        if (t < 0 || t > 1) {
            return null; // Collision happens outside the current time step
        }

        const collisionPoint = new Vector2(
            poly1.x + poly1.vx * t,
            poly1.y + poly1.vy * t
        );

        return {
            time: t,
            point: collisionPoint
        };
    }

    static projectPolygon(polygon, axis) {
        let min = Infinity;
        let max = -Infinity;

        for (const vertex of polygon.vertices) {
            const projection = vertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return [min, max];
    }

    static debugRender(ctx, poly1, poly2, collision) {
        // Draw polygons
        this.drawPolygon(ctx, poly1, 'blue');
        this.drawPolygon(ctx, poly2, 'red');

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

    static drawPolygon(ctx, polygon, color) {
        ctx.beginPath();
        ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);
        for (let i = 1; i < polygon.vertices.length; i++) {
            ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}
